# 坦克大战 + Java面试题 网页游戏设计文档

## 1. 项目概述

网页版坦克大战，核心创新：击败敌方坦克或拾取地图道具后触发Java面试题，答对加攻击力，答错扣血量。错题自动记录，玩家可收藏至错题本复习。

### 1.1 技术栈

- **前端**：HTML5 Canvas + 原生JavaScript（模块化）
- **后端**：Java + Spring Boot（REST API）
- **数据库**：MySQL（开发阶段可用H2）
- **构建工具**：Maven

### 1.2 玩家模式

单人 vs AI敌方坦克

---

## 2. 架构设计

```
┌─────────────────────────────────┐
│         前端 (HTML5 Canvas)       │
│  ┌──────┐ ┌──────┐ ┌──────────┐ │
│  │Game  │ │Render│ │  Quiz    │ │
│  │Engine│ │  er  │ │  Module  │ │
│  └──────┘ └──────┘ └──────────┘ │
│  ┌──────┐ ┌──────┐ ┌──────────┐ │
│  │Map   │ │Input │ │   UI     │ │
│  │Gen   │ │Mgr   │ │  Overlay │ │
│  └──────┘ └──────┘ └──────────┘ │
└────────────┬────────────────────┘
             │ REST API
┌────────────▼────────────────────┐
│     Spring Boot 后端              │
│  ┌──────────┐ ┌──────────────┐  │
│  │Question  │ │ WrongAnswer  │  │
│  │Controller│ │ Controller   │  │
│  └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────────┐  │
│  │Question  │ │ WrongAnswer  │  │
│  │Service   │ │ Service      │  │
│  └──────────┘ └──────────────┘  │
│  ┌──────────────────────────┐   │
│  │     MySQL / H2 数据库     │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

---

## 3. 前端模块设计

### 3.1 GameEngine - 游戏主循环

- requestAnimationFrame 驱动，60fps
- 管理游戏状态：`PLAYING` / `QUIZ` / `PAUSED` / `GAME_OVER` / `WIN`
- 协调各模块更新顺序：Input → GameLogic → Render

### 3.2 Renderer - Canvas渲染

- 地图渲染：墙壁、通道、道具
- 坦克渲染：玩家/敌方，含方向动画（上/下/左/右）
- 子弹渲染 + 爆炸特效
- HUD层：血量条、攻击力、分数、剩余敌人数

### 3.3 MapGen - 迷宫生成

- 预设3-5张地图模板，游戏随机选择
- 网格：16×12格，每格40×40像素，画布640×480
- 通道宽度：2格（80px），坦克可自由转向
- 路线清晰，主通道连通，无死胡同
- 刷新点：敌方出生点（顶部/右侧分散）、答题道具点

### 3.4 InputMgr - 输入控制

- 键盘WASD或方向键控制移动
- 空格键射击
- 射击冷却500ms

### 3.5 QuizModule - 答题系统

**触发方式：**
1. 击败敌方坦克 → 弹出答题界面，游戏暂停
2. 地图上碰触答题道具（问号图标）→ 触发答题

**答题流程：**
- 弹窗展示题目 + 4个选项（A/B/C/D）
- 倒计时30秒
- 选择后即时反馈（绿色正确/红色错误）
- 展示答案解析

**奖惩机制：**
- 答对：攻击力 +5
- 答错：血量 -10，自动记录错题到后端

**题源策略：**
- 优先使用前端内置题库（JSON，约50道）
- 后端题库作为补充 + 错题持久化

### 3.6 UIOverlay - 界面覆盖层

- 开始菜单（输入昵称、开始游戏）
- 暂停菜单（继续/重新开始）
- 错题本（游戏内嵌，随时可查看，收藏+笔记+标记掌握）
- 结算画面（得分统计、错题回顾）

---

## 4. 后端设计

### 4.1 REST API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/questions/random` | 随机获取一道题 |
| GET | `/api/questions/random?difficulty=hard` | 按难度随机获取 |
| GET | `/api/questions/{id}` | 获取指定题目 |
| POST | `/api/wrong-answers` | 记录错题（自动） |
| GET | `/api/wrong-answers?player={name}` | 获取错题历史 |
| POST | `/api/notebook` | 收藏错题到错题本 |
| GET | `/api/notebook?player={name}` | 获取错题本列表 |
| PUT | `/api/notebook/{id}` | 更新笔记/掌握状态 |

### 4.2 数据模型

```sql
-- 题目表
CREATE TABLE question (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(50) NOT NULL,    -- 分类：集合/多线程/IO/JVM/设计模式等
  difficulty VARCHAR(20) NOT NULL,  -- easy/medium/hard
  content TEXT NOT NULL,            -- 题干
  option_a VARCHAR(500) NOT NULL,
  option_b VARCHAR(500) NOT NULL,
  option_c VARCHAR(500) NOT NULL,
  option_d VARCHAR(500) NOT NULL,
  answer CHAR(1) NOT NULL,          -- 正确答案 A/B/C/D
  explanation TEXT                  -- 解析
);

-- 错题记录表（自动记录，不删除）
CREATE TABLE wrong_answer (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  question_id BIGINT NOT NULL,
  player_name VARCHAR(50) NOT NULL,
  wrong_option CHAR(1) NOT NULL,    -- 选了哪个错误选项
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES question(id)
);

-- 错题本表（玩家主动收藏）
CREATE TABLE notebook (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  wrong_answer_id BIGINT NOT NULL,
  player_name VARCHAR(50) NOT NULL,
  note TEXT,                        -- 玩家笔记
  review_count INT DEFAULT 0,       -- 复习次数
  mastered BOOLEAN DEFAULT FALSE,   -- 是否已掌握
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wrong_answer_id) REFERENCES wrong_answer(id)
);
```

### 4.3 题目分类

Java面试题分类覆盖：
- 集合框架（ArrayList/HashMap/ConcurrentHashMap等）
- 多线程与并发（synchronized/volatile/线程池等）
- JVM（内存模型/垃圾回收/类加载等）
- IO与NIO
- 设计模式
- Spring框架（IOC/AOP/事务等）
- 基础语法（泛型/异常/String等）

---

## 5. 游戏机制

### 5.1 坦克属性

| 属性 | 玩家初始值 | 说明 |
|------|-----------|------|
| 血量 | 100 | 归零则游戏结束 |
| 攻击力 | 10 | 答对一题 +5 |
| 移速 | 3px/帧 | |
| 子弹速度 | 6px/帧 | |
| 射击冷却 | 500ms | 防连射 |

### 5.2 敌方坦克类型

| 类型 | 血量 | 攻击力 | 行为 | 题目难度 |
|------|------|--------|------|----------|
| 普通型 | 30 | 5 | 随机巡逻 | 随机 |
| 精英型 | 60 | 10 | 追踪玩家 | 高难度 |

### 5.3 胜负条件

- **胜利**：消灭当前关卡所有敌方坦克
- **失败**：玩家血量归零

### 5.4 答题奖惩

- 答对：攻击力 +5，绿色特效
- 答错：血量 -10，红色特效，自动记录错题

---

## 6. 地图设计

- 网格：16×12格，每格40×40像素，画布640×480
- 通道宽度：2格（80px），坦克可自由转向
- 墙壁：深灰方块，不可穿越，阻挡子弹
- 通道：浅色背景，自由移动
- 答题道具：闪烁问号图标，碰触触发答题
- 玩家出生点：左下角（固定）
- 敌方出生点：顶部/右侧分散，3-5个点
- 预设3-5张地图模板，随机选择

---

## 7. 项目结构

```
坦克大战/
├── frontend/                    # 前端项目
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js              # 入口
│   │   ├── engine/
│   │   │   ├── GameEngine.js    # 游戏主循环
│   │   │   ├── InputMgr.js      # 输入管理
│   │   │   └── CollisionMgr.js  # 碰撞检测
│   │   ├── entities/
│   │   │   ├── Tank.js          # 坦克基类
│   │   │   ├── PlayerTank.js    # 玩家坦克
│   │   │   ├── EnemyTank.js     # 敌方坦克
│   │   │   ├── Bullet.js        # 子弹
│   │   │   └── QuizItem.js      # 答题道具
│   │   ├── map/
│   │   │   ├── MapGen.js        # 地图生成
│   │   │   └── maps/            # 预设地图数据
│   │   ├── quiz/
│   │   │   ├── QuizModule.js    # 答题逻辑
│   │   │   └── questions.js     # 内置题库
│   │   └── ui/
│   │       ├── Renderer.js      # Canvas渲染
│   │       ├── UIOverlay.js     # UI覆盖层
│   │       └── Notebook.js      # 错题本
│   └── assets/                  # 图片素材
│       ├── tanks/
│       ├── tiles/
│       └── effects/
└── backend/                     # Spring Boot后端
    ├── pom.xml
    └── src/main/java/com/tankquiz/
        ├── TankQuizApplication.java
        ├── controller/
        │   ├── QuestionController.java
        │   ├── WrongAnswerController.java
        │   └── NotebookController.java
        ├── service/
        │   ├── QuestionService.java
        │   ├── WrongAnswerService.java
        │   └── NotebookService.java
        ├── entity/
        │   ├── Question.java
        │   ├── WrongAnswer.java
        │   └── Notebook.java
        ├── repository/
        │   ├── QuestionRepository.java
        │   ├── WrongAnswerRepository.java
        │   └── NotebookRepository.java
        └── resources/
            ├── application.yml
            └── data.sql            # 初始题库数据
```

---

## 8. 开发顺序

1. 后端：Spring Boot项目 + 数据模型 + REST API + 初始题库
2. 前端：Canvas基础渲染 + 地图 + 玩家坦克移动
3. 前端：敌方坦克AI + 碰撞检测 + 子弹系统
4. 前端：答题系统 + 前端内置题库
5. 前端：错题本UI + 后端联调
6. 前端：游戏菜单 + 结算画面 + 音效/特效
7. 联调测试 + 优化
