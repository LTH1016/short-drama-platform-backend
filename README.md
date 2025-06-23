# 短剧平台后端API

基于Node.js + Express + TypeScript + MongoDB构建的短剧平台后端服务。

## 🚀 功能特性

### Phase 1 - 基础功能 ✅
- ✅ 短剧管理 (CRUD操作)
- ✅ 分类管理
- ✅ 搜索功能
- ✅ 推荐系统 (热门/最新/趋势)
- ✅ 缓存机制 (Redis)
- ✅ API限流保护
- ✅ 错误处理和日志

### Phase 2 - 用户系统 (待实现)
- 🔄 用户注册/登录
- 🔄 JWT身份认证
- 🔄 权限管理

### Phase 3 - 高级功能 (待实现)
- 🔄 个性化推荐
- 🔄 全文搜索 (Elasticsearch)
- 🔄 数据分析

### Phase 4 - 互动功能 (待实现)
- 🔄 收藏系统
- 🔄 观看历史
- 🔄 评论系统

## 🛠️ 技术栈

- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MongoDB
- **缓存**: Redis
- **验证**: Joi + express-validator
- **日志**: Winston
- **安全**: Helmet + CORS + Rate Limiting

## 📦 安装和运行

### 环境要求

- Node.js >= 18.0.0
- MongoDB >= 5.0
- Redis >= 6.0 (可选，用于缓存)

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 环境配置

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# 服务器配置
NODE_ENV=development
PORT=3001
API_PREFIX=/api/v1

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/drama-platform

# Redis配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT配置 (Phase 2需要)
JWT_SECRET=your-super-secret-jwt-key

# CORS配置
CORS_ORIGIN=http://localhost:3000
```

### 数据库初始化

运行数据初始化脚本：

```bash
npm run seed
# 或
npx ts-node src/scripts/seedData.ts
```

### 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 📚 API文档

### 基础信息

- **Base URL**: `http://localhost:3001/api/v1`
- **Content-Type**: `application/json`

### 短剧相关API

#### 获取短剧列表
```http
GET /api/v1/dramas
```

查询参数：
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)
- `category`: 分类筛选
- `search`: 搜索关键词
- `sortBy`: 排序字段 (createdAt|rating|viewCount|releaseDate)
- `sortOrder`: 排序方向 (asc|desc)

#### 获取短剧详情
```http
GET /api/v1/dramas/:id
```

#### 搜索短剧
```http
GET /api/v1/dramas/search?q=关键词
```

#### 获取推荐短剧
```http
GET /api/v1/dramas/recommendations
```

#### 获取热门短剧
```http
GET /api/v1/dramas/hot?limit=10
```

#### 获取最新短剧
```http
GET /api/v1/dramas/new?limit=10
```

#### 获取趋势短剧
```http
GET /api/v1/dramas/trending?limit=10
```

#### 增加观看次数
```http
POST /api/v1/dramas/:id/view
```

### 分类相关API

#### 获取活跃分类
```http
GET /api/v1/categories
```

#### 获取所有分类
```http
GET /api/v1/categories/all
```

#### 获取分类统计
```http
GET /api/v1/categories/stats
```

#### 创建分类
```http
POST /api/v1/categories
Content-Type: application/json

{
  "name": "分类名称",
  "color": "#FF6B9D",
  "description": "分类描述",
  "sortOrder": 1,
  "isActive": true
}
```

### 响应格式

成功响应：
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

错误响应：
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 开发指南

### 项目结构

```
src/
├── config/          # 配置文件
│   ├── database.ts  # 数据库配置
│   └── redis.ts     # Redis配置
├── controllers/     # 控制器
├── middleware/      # 中间件
├── models/          # 数据模型
├── routes/          # 路由定义
├── services/        # 业务逻辑
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
├── scripts/         # 脚本文件
└── server.ts        # 服务器入口
```

### 代码规范

- 使用TypeScript严格模式
- 遵循ESLint规则
- 使用Prettier格式化代码
- 编写单元测试

### 添加新功能

1. 在 `types/` 中定义类型接口
2. 在 `models/` 中创建数据模型
3. 在 `services/` 中实现业务逻辑
4. 在 `controllers/` 中创建控制器
5. 在 `routes/` 中定义路由
6. 更新API文档

## 🧪 测试

```bash
# 运行测试
npm test

# 运行测试覆盖率
npm run test:coverage
```

## 📊 监控和日志

### 健康检查

```http
GET /health
```

返回服务状态和依赖服务状态。

### 日志

日志文件位置：
- `logs/combined.log` - 所有日志
- `logs/error.log` - 错误日志
- `logs/exceptions.log` - 异常日志

## 🚀 部署

### Docker部署

```bash
# 构建镜像
docker build -t drama-platform-backend .

# 运行容器
docker run -p 3001:3001 drama-platform-backend
```

### PM2部署

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start dist/server.js --name drama-api

# 查看状态
pm2 status

# 查看日志
pm2 logs drama-api
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 项目链接: [GitHub Repository]
- 问题反馈: [GitHub Issues]

## 🔄 更新日志

### v1.0.0 (2024-01-01)
- ✅ 实现基础短剧管理功能
- ✅ 实现分类管理功能
- ✅ 实现搜索和推荐功能
- ✅ 添加缓存和限流保护
- ✅ 完善错误处理和日志系统
