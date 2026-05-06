# 坦克大战 + Java面试题

网页坦克大战游戏，击败敌方坦克触发Java面试题问答。答对加攻击力，答错扣血并记录错题本供复习。

## 技术栈

- **前端**: HTML5 Canvas + 原生JavaScript (ES6模块)
- **后端**: Spring Boot 3.2.5 + Spring Data JPA
- **数据库**: H2 (开发) / MySQL (生产)

## 快速开始

### 启动后端

```bash
cd backend
mvn spring-boot:run
```

后端运行在 `http://localhost:8080`，H2控制台: `http://localhost:8080/h2-console`

### 启动前端

```bash
cd frontend
python -m http.server 8000
```

浏览器打开 `http://localhost:8000`

> 前端也可直接打开 `frontend/index.html`，但答题和错题本功能需要后端运行。

## 游戏玩法

| 操作 | 按键 |
|------|------|
| 移动 | WASD / 方向键 |
| 射击 | 空格 |

- 击败普通敌方坦克 → 随机题目
- 击败精英坦克(红色) → 高难度题目
- 拾取地图上的 `?` 道具 → 随机题目
- 答对: 攻击力 +5，得分 +50
- 答错: 血量 -10，自动记录错题本

## 项目结构

```
├── backend/                    # Spring Boot 后端
│   └── src/main/java/com/tankquiz/
│       ├── entity/             # Question, WrongAnswer, Notebook
│       ├── repository/         # JPA数据访问
│       ├── service/            # 业务逻辑
│       └── controller/         # REST API
├── frontend/                   # 前端
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── engine/             # 游戏引擎、输入、碰撞
│       ├── entities/           # 坦克、子弹、道具
│       ├── map/                # 地图生成
│       ├── quiz/               # 答题系统 + 50道内置题库
│       └── ui/                 # 渲染、错题本UI
└── docs/                       # 设计文档和实现计划
```

## API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/questions/random` | 随机题目 (可选 `?difficulty=easy/medium/hard`) |
| GET | `/api/questions/{id}` | 指定题目 |
| POST | `/api/wrong-answers` | 记录错答 |
| GET | `/api/wrong-answers?player={name}` | 查询错答记录 |
| POST | `/api/notebook` | 添加到错题本 |
| GET | `/api/notebook?player={name}` | 查询错题本 |
| PUT | `/api/notebook/{id}` | 更新错题本 (掌握状态/笔记) |

## 题库

50道Java面试题，覆盖7大分类:

- 集合 (10题)
- 多线程 (10题)
- JVM (8题)
- IO/NIO (5题)
- 设计模式 (5题)
- Spring (7题)
- Java基础 (5题)
