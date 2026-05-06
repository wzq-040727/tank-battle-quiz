INSERT INTO question (category, difficulty, content, option_a, option_b, option_c, option_d, answer, explanation) VALUES
-- 集合框架 (10题)
('集合', 'easy', 'HashMap的默认初始容量是多少？', '8', '16', '32', '64', 'B', 'HashMap默认初始容量为16，必须是2的幂次方。'),
('集合', 'easy', 'ArrayList基于什么数据结构实现？', '链表', '动态数组', '红黑树', '哈希表', 'B', 'ArrayList底层基于Object数组实现，支持随机访问。'),
('集合', 'medium', 'HashMap在什么情况下会从链表转为红黑树？', '元素超过8个', '元素超过16个', '容量超过64', '负载因子超过0.75', 'A', '当链表长度超过8且数组长度超过64时，链表会转为红黑树。'),
('集合', 'medium', 'ConcurrentHashMap使用什么机制保证线程安全？', 'synchronized', 'CAS + synchronized', 'ReentrantLock', 'volatile', 'B', 'JDK8中ConcurrentHashMap使用CAS操作和synchronized锁桶头节点。'),
('集合', 'easy', 'HashSet底层使用什么实现？', 'ArrayList', 'HashMap', 'LinkedList', 'TreeMap', 'B', 'HashSet底层使用HashMap，元素作为key，value统一使用PRESENT常量。'),
('集合', 'medium', 'TreeMap的底层数据结构是什么？', '哈希表', '数组', '红黑树', '链表', 'C', 'TreeMap基于红黑树实现，保证key的有序性。'),
('集合', 'hard', 'HashMap的扩容机制是什么？', '容量翻倍，重新哈希', '容量+1', '容量翻倍，高位判断分流', '容量*1.5', 'C', 'JDK8扩容时容量翻倍，通过hash & oldCap判断元素在新数组中的位置。'),
('集合', 'medium', 'List和Set的区别？', 'List有序可重复，Set无序不重复', 'List线程安全', 'Set支持随机访问', '两者完全相同', 'A', 'List有序且允许重复元素，Set无序且不允许重复。'),
('集合', 'easy', 'Iterator的remove方法和集合的remove方法有什么区别？', '完全相同', 'Iterator的remove更安全', '集合的remove更安全', '都不能在遍历时使用', 'B', 'Iterator的remove方法不会导致ConcurrentModificationException。'),
('集合', 'hard', 'WeakHashMap的特点是什么？', 'key是弱引用，GC时可能被回收', '容量自动扩展', '线程安全', 'value是弱引用', 'A', 'WeakHashMap的key使用弱引用，当key没有其他引用时会被GC回收。'),

-- 多线程与并发 (10题)
('多线程', 'medium', 'synchronized和ReentrantLock的区别？', 'synchronized可中断，Lock不可', 'Lock可中断，synchronized不可', '完全相同', 'synchronized支持公平锁', 'B', 'ReentrantLock支持可中断、超时、公平锁，synchronized自动释放更简单。'),
('多线程', 'easy', 'volatile关键字的作用？', '保证原子性', '保证可见性和有序性', '保证线程安全', '替代synchronized', 'B', 'volatile保证变量的可见性和禁止指令重排序，但不保证原子性。'),
('多线程', 'medium', '线程池的核心参数有哪些？', 'corePoolSize, maxPoolSize, keepAliveTime, workQueue, handler', '只有corePoolSize', 'corePoolSize和maxPoolSize', 'corePoolSize和workQueue', 'A', '线程池有5个核心参数：核心线程数、最大线程数、存活时间、工作队列、拒绝策略。'),
('多线程', 'medium', 'CAS操作的ABA问题如何解决？', '使用synchronized', '使用版本号（AtomicStampedReference）', '使用volatile', '无法解决', 'B', 'AtomicStampedReference通过版本号解决ABA问题。'),
('多线程', 'easy', '创建线程的方式有哪些？', '只有继承Thread类', '只有实现Runnable接口', '继承Thread或实现Runnable/Callable', '只有实现Callable', 'C', '创建线程有三种方式：继承Thread、实现Runnable、实现Callable。'),
('多线程', 'hard', 'CountDownLatch和CyclicBarrier的区别？', '完全相同', 'CountDownLatch不可重用，CyclicBarrier可重用', 'CyclicBarrier不可重用', 'CountDownLatch可重用', 'B', 'CountDownLatch是一次性的，CyclicBarrier可重置复用。'),
('多线程', 'medium', 'ThreadLocal的原理？', '每个线程有自己的变量副本', '使用synchronized同步', '存储在堆上', '使用CAS', 'A', 'ThreadLocal为每个线程维护独立的变量副本，存储在Thread的ThreadLocalMap中。'),
('多线程', 'medium', '死锁的四个必要条件？', '互斥、请求保持、不可剥夺、循环等待', '只有互斥和循环等待', '互斥和不可剥夺', '请求保持和循环等待', 'A', '死锁需要同时满足四个条件：互斥、请求与保持、不可剥夺、循环等待。'),
('多线程', 'hard', 'AQS的核心思想？', '使用CAS', 'CLH队列 + volatile state', '使用synchronized', '使用Lock', 'B', 'AQS基于CLH队列和volatile int state实现同步器。'),
('多线程', 'easy', 'sleep和wait的区别？', '完全相同', 'sleep释放锁，wait不释放', 'sleep不释放锁，wait释放锁', '都不释放锁', 'C', 'sleep是Thread方法不释放锁，wait是Object方法释放锁。'),

-- JVM (8题)
('JVM', 'medium', 'JVM内存分为哪几部分？', '堆、栈、方法区', '堆、栈、程序计数器、方法区、本地方法栈', '只有堆和栈', '堆、栈、方法区、PC', 'B', 'JVM运行时数据区包括堆、虚拟机栈、程序计数器、方法区、本地方法栈。'),
('JVM', 'medium', 'Java中哪些对象可以作为GC Roots？', '只有局部变量', '虚拟机栈引用的对象、静态变量、常量', '所有对象', '只有堆中的对象', 'B', 'GC Roots包括虚拟机栈引用、静态变量、常量、JNI引用等。'),
('JVM', 'easy', '常见的垃圾回收算法？', '只有标记-清除', '标记-清除、标记-整理、复制算法、分代收集', '只有复制算法', '只有引用计数', 'B', '常见GC算法有标记-清除、标记-整理、复制算法，分代收集是综合策略。'),
('JVM', 'hard', 'CMS和G1的区别？', '完全相同', 'CMS追求低停顿，G1追求吞吐量', 'CMS是老年代收集器，G1是整堆收集器', 'G1更简单', 'C', 'CMS针对老年代，追求低停顿；G1是整堆收集器，可预测停顿时间。'),
('JVM', 'medium', '类加载的五个阶段？', '加载、验证、准备、解析、初始化', '只有加载和初始化', '加载、编译、运行', '加载、链接、运行', 'A', '类加载过程：加载→验证→准备→解析→初始化。'),
('JVM', 'medium', '双亲委派模型的作用？', '提高加载速度', '防止类重复加载，保证核心类安全', '减少内存占用', '支持热部署', 'B', '双亲委派保证核心类库不被篡改，避免重复加载。'),
('JVM', 'easy', '堆和栈的区别？', '完全相同', '堆存对象，栈存局部变量和方法调用', '栈存对象', '堆存局部变量', 'B', '堆存储对象实例，栈存储局部变量、方法调用和返回值。'),
('JVM', 'hard', '什么时候会发生Full GC？', '只有老年代满', '老年代满、方法区满、System.gc()、空间分配担保失败', '只有System.gc()', 'Minor GC后', 'B', 'Full GC触发条件：老年代不足、方法区不足、System.gc()、担保失败。'),

-- IO与NIO (5题)
('IO', 'easy', 'BIO、NIO、AIO的区别？', '完全相同', 'BIO阻塞，NIO多路复用，AIO异步', '只有BIO是阻塞的', 'NIO是阻塞的', 'B', 'BIO是同步阻塞，NIO是同步非阻塞（多路复用），AIO是异步非阻塞。'),
('IO', 'medium', 'NIO的核心组件？', 'Channel、Buffer、Selector', '只有Channel', 'Stream和Channel', 'Buffer和Stream', 'A', 'NIO三大核心：Channel（通道）、Buffer（缓冲区）、Selector（多路复用器）。'),
('IO', 'medium', 'InputStream和Reader的区别？', '完全相同', 'InputStream处理字节流，Reader处理字符流', 'Reader处理字节流', 'InputStream处理字符流', 'B', 'InputStream是字节流基类，Reader是字符流基类。'),
('IO', 'easy', 'Java中有几种IO模型？', '只有BIO', 'BIO、NIO、AIO', 'BIO和NIO', 'NIO和AIO', 'B', 'Java支持三种IO模型：BIO（阻塞IO）、NIO（非阻塞IO）、AIO（异步IO）。'),
('IO', 'hard', 'Selector的作用是什么？', '缓冲数据', '单线程监控多个Channel的IO事件', '处理字符编码', '管理文件句柄', 'B', 'Selector允许单线程监控多个Channel的连接、读写事件，实现多路复用。'),

-- 设计模式 (5题)
('设计模式', 'easy', '单例模式有几种实现方式？', '只有饿汉式', '饿汉式、懒汉式、双重检查锁、静态内部类、枚举', '只有懒汉式', '饿汉式和懒汉式', 'B', '单例模式有5种常见实现：饿汉式、懒汉式、双重检查锁、静态内部类、枚举。'),
('设计模式', 'medium', '工厂模式分为哪几种？', '只有简单工厂', '简单工厂、工厂方法、抽象工厂', '工厂方法和抽象工厂', '只有抽象工厂', 'B', '工厂模式分为简单工厂、工厂方法模式、抽象工厂模式三种。'),
('设计模式', 'medium', '代理模式的作用？', '替代原对象', '在不修改原对象的情况下增强功能', '提高性能', '减少代码量', 'B', '代理模式在不修改原对象的前提下，通过代理对象增强功能。'),
('设计模式', 'easy', '观察者模式的核心思想？', '一对多依赖，状态变化通知所有观察者', '一对一通信', '链式调用', '事件驱动', 'A', '观察者模式定义一对多依赖，当对象状态变化时自动通知所有依赖者。'),
('设计模式', 'hard', 'Spring中使用了哪些设计模式？', '只有工厂模式', '工厂、代理、单例、模板方法、观察者等', '只有代理模式', '只有单例模式', 'B', 'Spring使用了工厂模式（BeanFactory）、代理模式（AOP）、单例模式、模板方法等。'),

-- Spring框架 (7题)
('Spring', 'medium', 'Spring IOC的原理？', '反射', '工厂模式 + 反射 + XML/注解解析', '代理模式', '动态代理', 'B', 'IOC通过工厂模式创建Bean，利用反射注入依赖，解析XML或注解配置。'),
('Spring', 'medium', 'Spring AOP的实现原理？', '反射', 'JDK动态代理或CGLIB', '字节码增强', '代理模式', 'B', 'Spring AOP对有接口的类使用JDK动态代理，无接口的类使用CGLIB。'),
('Spring', 'easy', 'Spring Bean的默认作用域？', 'prototype', 'singleton', 'request', 'session', 'B', 'Spring Bean默认是singleton（单例）作用域。'),
('Spring', 'medium', 'Spring事务传播行为有几种？', '3种', '7种', '5种', '6种', 'B', 'Spring有7种事务传播行为：REQUIRED、SUPPORTS、MANDATORY、REQUIRES_NEW、NOT_SUPPORTED、NEVER、NESTED。'),
('Spring', 'hard', 'Spring Bean的生命周期？', '只有初始化和销毁', '实例化→属性注入→初始化→使用→销毁', '只有实例化', '实例化→使用→销毁', 'B', 'Bean生命周期：实例化→属性注入→Aware接口回调→BeanPostProcessor→初始化→使用→销毁。'),
('Spring', 'medium', '@Autowired和@Resource的区别？', '完全相同', '@Autowired按类型注入，@Resource按名称注入', '@Resource按类型注入', '都不支持required属性', 'B', '@Autowired默认按类型注入（Spring），@Resource默认按名称注入（JDK）。'),
('Spring', 'easy', 'Spring Boot的核心优势？', '性能更好', '自动配置、起步依赖、内嵌服务器', '更安全', '支持更多数据库', 'B', 'Spring Boot核心优势：自动配置（AutoConfiguration）、起步依赖（Starter）、内嵌Web服务器。'),

-- 基础语法 (5题)
('基础', 'easy', 'String、StringBuilder、StringBuffer的区别？', '完全相同', 'String不可变，StringBuilder非线程安全，StringBuffer线程安全', 'String可变', 'StringBuilder线程安全', 'B', 'String是不可变的，StringBuilder可变但非线程安全，StringBuffer可变且线程安全。'),
('基础', 'medium', 'Java泛型的类型擦除是什么？', '编译时检查，运行时擦除泛型信息', '运行时保留泛型', '编译时擦除', '不影响运行时', 'A', 'Java泛型在编译时检查类型安全，运行时擦除为原始类型（Raw Type）。'),
('基础', 'easy', '==和equals的区别？', '完全相同', '==比较引用，equals比较内容', '==比较内容', 'equals比较引用', 'B', '==比较引用地址（基本类型比较值），equals默认比较引用，可重写比较内容。'),
('基础', 'medium', 'final、finally、finalize的区别？', '完全相同', 'final修饰不可变，finally异常清理，finalize GC前调用', '都用于异常处理', '都用于修饰类', 'B', 'final修饰不可变，finally保证代码执行，finalize是Object的方法在GC前调用。'),
('基础', 'hard', 'Java自动装箱的缓存机制？', '没有缓存', 'Integer缓存-128~127', '缓存所有Integer', '只缓存正数', 'B', 'IntegerCache缓存-128到127的Integer对象，范围内自动装箱返回同一对象。');
