# Clippy

Clippy는 팀 또는 개인이 북마크를 폴더별로 모아 관리할 수 있는 링크 관리 서비스입니다. Google 계정으로 로그인해 폴더를 만들고 링크를 저장하거나, 초대 링크를 통해 다른 사용자와 폴더를 공유할 수 있습니다. 현재 태그 기능은 개발 중입니다.

### 주요 기능

- **폴더 관리** – 링크를 폴더별로 분류해 깔끔하게 정리
- **링크 저장** – 브라우저에서 손쉽게 링크 정보를 저장
- **팀원 초대** – 폴더 초대 링크로 다른 사용자와 손쉽게 협업
- **언제 어디서나** – 기기 제약 없이 어디서든 접속 가능
- *(예정) 태그 관리로 더 편리한 검색*

### 기술 스택

- Next.js 15 / React 19 / TypeScript
- Tailwind CSS 기반 UI
- Firebase Authentication
- Prisma ORM

### 폴더 구조와 DDD 적용

`src/` 디렉터리는 Domain-Driven Design(DDD)을 기반으로 한 계층형 구조를 따릅니다.

- `app/` – Next.js 라우트 페이지
- `application/` – Use case 등 응용 서비스 로직
- `domain/` – 리포지토리 인터페이스와 도메인 규칙
- `infrastructure/` – Prisma 구현체와 의존성 주입 설정
- `presentation/` – API 라우트와 입출력 계층
- 공통 UI와 유틸리티는 `components/`, `hooks/`, `lib/`, `services/`, `stores/`, `types/`에 위치합니다.

DDD 패턴을 적용해 비즈니스 로직과 인프라 코드를 명확히 분리하여 유지보수성을 높였습니다.

### 로컬 개발

```bash
npm install
npm run dev
npm run build

```
테스트는 Jest를 사용하며 npm test 로 실행할 수 있습니다.

배포 사이트
https://clippy-nextjs.vercel.app/ko

