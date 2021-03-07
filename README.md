# CodePlat(2021.01 - 2021.2)

![plat-logo](https://user-images.githubusercontent.com/52441478/109408651-b9a8bf80-79ce-11eb-97d5-2eb50bf0712c.png)

<br>

## 0. Contents

[1. Project Summary](#1-project-summary)

[2. Project target](#2-project-target)

[3. Main features](#3-main-features)

[4. Frontend](#4-frontend)

[5. Backend](#5-backend)

[6. How to Run](#6-how-to-run)

[7. Cooperation & Testing Tool](#7-cooperation-&-testing-tool)

[8. Contributor](#8-contributor)

<br>

## 1. Project Summary

![image](https://user-images.githubusercontent.com/52441478/109414651-51220880-79f7-11eb-8d8a-6fa3376f0a73.png)

CodePlat은 2명의 팀원이 겨울방학 약 50여일 간 개발한 사이드 프로젝트로, 학생, 직장인, 프리랜서, 디자이너 등에게 프로젝트 혹은 스터디 구인, 참여 및 커뮤니티 기능을 제공하는 서비스 플랫폼입니다. 사용자는 스터디 및 프로젝트 모집, 구인 뿐 아니라 커뮤니티 및 채팅 기능을 활용하여 다른 사용자와의 원활한 교류를 할 수 있습니다.

<br>

## 2. Project target

현직 개발자 뿐 아니라 디자이너, 학생도 공개적으로 개발관련 스터디나 프로젝트에 참여하거나 모집할 수 있도록 프로젝트 사용자 타겟을 설정하였습니다.

<br>

## 3. Main features

### 3.1 Authentication

<center><img src="https://user-images.githubusercontent.com/52441478/109410492-748c8980-79de-11eb-8be9-d629b8e851fa.png" width="450" ></center>

<center><img src="https://user-images.githubusercontent.com/52441478/109410540-cc2af500-79de-11eb-903b-f80d0c1c0863.png" width="450" ></center>

로컬 회원가입 뿐 아니라 소셜 회원가입도 지원하여 사용자의 편의성을 증대하였습니다. 또한 비밀번호 찾기 및 변경기능을 제공하고, 이메일 인증 시스템을 제공하여 유연한 사용자 정보 관리를 할 수 있도록 노력하였습니다. 회원 인증 기능은 firebase의 인증 모듈 등과 같은 별도의 툴 없이 프론트와 백에서 직접 유효성 검증 로직을 구성하여 개발하였습니다.

<br>

### 3.2 CRUD

#### 3.2.1 Create & Read

![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/52441478/109411483-c97fce00-79e5-11eb-99f3-74db9954966a.gif)

quill editor 라이브러리를 적용하여 사용자가 작성한 코드 신택스 하이라이팅 기능을 적용하였습니다. 또한 사용자는 프로젝트 특성에 맞게 기술을 선정할 수 있고, 원하는 파일을 업로드할 수도 있습니다.
인피니트 스크롤링 로직을 구현하여 별도의 페이지네이션 없이 사용자가 편리하게 게시글 리스트를 파악할 수 있도록 하였습니다. 또한 해당 스터디나 프로젝트의 기술 혹은 지역 정보로 게시글을 필터링할 수 있고 게시글 검색 기능도 추가하였습니다.

#### 3.2.2 Update & Delete

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/52441478/109411665-10ba8e80-79e7-11eb-91ff-0206492dbd6a.gif)

<br>

### 3.3 Post Scrap & Like, Comment

![ezgif com-gif-maker (4)](https://user-images.githubusercontent.com/52441478/109412767-3e0a3b00-79ed-11eb-9439-5e899adbdd0c.gif)

<br>

### 3.4 Realtime Chat & Chat notification

![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/52441478/109412980-6cd4e100-79ee-11eb-9f53-6e34b8e9f2c3.gif)

realtime database를 지원하는 firebase를 사용하여 사용자간 실시간 채팅과 알림기능을 구현하였습니다.

### 3.5 Responsive Design

![ezgif com-gif-maker (6)](https://user-images.githubusercontent.com/52441478/109413735-49139a00-79f2-11eb-8918-caf995f0a818.gif)

각 페이지마다 반응형 CSS 디자인을 도입하여 모바일 환경에서도 플랫폼을 원활하게 이용할 수 있도록 하였습니다.

<br>

## 4. Frontend

### 4.1 Main Techstack

- React.js, next.js, redux, redux-saga, styled-components, antd, axios, firebase

<br>

### 4.2 Directory Structure

<img width="171" alt="스크린샷 2021-02-28 오후 2 38 36" src="https://user-images.githubusercontent.com/52441478/109409081-c8917100-79d2-11eb-80db-d5300b30215d.png">

React hook의 자유도 높은 활용성 덕분에 컴포넌트를 Container, Presentational로 나누는 구조를 채택하지 않고 내부 컴포넌트에서 로직처리와 렌더링을 모두 처리하는 방법을 채택하였습니다.

<br>

### 4.3 SSR (Server Side Rendering)

프로젝트 특성상 구인 및 모집 포스트, 커뮤니티 게시글이 검색엔진에 최적화되어야 더 많은 사용자의 유입 및 원활한 사이트 운영이 가능하다는 판단을 하였고, 페이지 초기 로드 속도를 높여 사용자 경험을 증진 시키기 위해 SSR을 적용하였습니다. 또한 코드스플리팅 및 유용한 SSR 기능을 보유하고있는 next.js 프레임워크를 사용하여 개발의 생산성을 도모하였습니다.

<br>

### 4.4 Redux, Redux-saga Architecture

Redux 패턴은 크게 action type, action creator, reducer 3가지의 분류로 나누어 설계하였고, Redux 데이터 비동기 처리는 redux-saga 를 이용하여 직관적으로 데이터 요청 과정을 파악할 수 있도록 Request-> Success/Failure의 패턴으로 설계 하였습니다. 또한 redux-actions 라이브러리를 사용하여 action 생성과 reducer handle을 보다 쉽게 하도록 노력했습니다.

- 예시

<center><img src="https://user-images.githubusercontent.com/52441478/109409824-2fb22400-79d9-11eb-8e39-659a2b8a7408.png" width="400" ></center>

<br>

### 4.5 Styling

개발 생산성을 위해 CSS UI 프레임워크인 antd를 사용하였고 styled-components 라이브러리를 적용하여 커스텀 디자인을 구현했습니다.



### 5. Backend

---

<img src="https://user-images.githubusercontent.com/62149784/110156864-d3ad2c80-7e2a-11eb-98c4-e7d7f027ec28.png">

<br>

### 5.1 DATABASE ERD

---

<img src="https://user-images.githubusercontent.com/62149784/110210126-9c468a80-7ed3-11eb-851e-87580a6aeb33.jpg">

<br>

### 5.2 Mongoose
---

✔ MongoDB의 ODM으로 널리 사용되고 코드 구성이나 개발 편의성 측면에서 장점이 많은 Mongoose를 사용했습니다.

✔ ES6와 mongoose 쿼리 빌더를 사용해 간단하고 직관적이게 코드를 구현하도록 노력했습니다.

<img src="https://user-images.githubusercontent.com/62149784/110210917-6b685480-7ed7-11eb-9e3c-64b8b25d113b.jpg">

<br>

<img src="https://user-images.githubusercontent.com/62149784/110210951-a23e6a80-7ed7-11eb-8b32-71a21561228b.jpg">


<br>

### 5.3 Mongoose aggregate

---

✔  기존의 mongoose 쿼리 빌더로는 원하는 데이터로 가공하는데 어려움을 겪어  데이터 처리 파이프라인의 개념을 모델로 하는 aggregate를 사용했습니다.

<br>



<br>


![aggregate code](https://user-images.githubusercontent.com/62149784/110211586-96a07300-7eda-11eb-893a-4f796e7f8683.jpg)

<br>

![댓글 순](https://user-images.githubusercontent.com/62149784/110211589-986a3680-7eda-11eb-93b6-312dcc0f7e44.jpg)

<br>

### 5.4 Model-Routes-Controllers Structure

___

<br>

<img src="https://user-images.githubusercontent.com/62149784/110213308-d1a6a480-7ee2-11eb-906f-6583a212cec4.jpg">

<br>

- Routres : 지원된 요청들을 알맞은 Controller 함수들로 보냅니다.  

- models : 데이터베이스에서 정보를 가져온 뒤, Controller에 전달합니다.


- Controllers : 모델로부터 요청된 데이터를 얻어내거나 , 얻어낸 데이터를 가공하여 처리합니다. 

<br>

✔ Model-Routes-Controllers Structure를 구현 하기 위한 Directory Structure

<br>


<img width="171" src="https://user-images.githubusercontent.com/62149784/110213612-1b43bf00-7ee4-11eb-9957-b96857ba82d6.jpg">

<br>

<img width="171" src="https://user-images.githubusercontent.com/62149784/110215777-e4bf7180-7eee-11eb-977e-4e1cc67518b0.jpg">

<br>

### 5.5 📢 One single source of truth

---

<br>

<img width="171" src="https://user-images.githubusercontent.com/62149784/110213933-8772f280-7ee5-11eb-9e5f-e4ce928f26a2.jpg">


<br>


  라우팅 하는 URL 주소를 routes.js 라는 파일을 만들어 따로 보관하므로써 재사용성을 확보하여 One single source of truth 원칙을 준수하려고 노력했습니다.

<br>

### 5.6 Restful API

___

<br>

REST에서 가장 중요하며 기본적인 규칙 두가지를 준수하기 위해 노력했습니다.

1.  URI는 정보의 자원을 표현해야 한다. (`리소스 식별`)
   
2. 자원에 대한 행위는 HTTP Method로 표현한다.

<br>



📌 ENDPOINT

<br>


<img src="https://user-images.githubusercontent.com/62149784/110215565-cc9b2280-7eed-11eb-8010-ab6d361afdb0.jpg">




<br>


✔ 두가지 규칙을 가지고 URI를 설계하는 것을 목표로 하고 그 상황에서 안될 때 컨트롤 URI를 사용하였습니다.


✔ 계층 구조상 상위를 컬렉션으로 보고 복수단어를 사용 했습니다.


✔ 게시글 작성 시 PRG(Post/Redirect/Get)을 사용해 게시글 중복 작성을 방지하였습니다.

<br>

### 5.7 Cloud Computing

---

<br>

✔ AWS-EC2 (Ubuntu)

- 하드웨어에 선투자할 필요가 없어 더 빠르게 애플리케이션을 개발하고 배포할 수 있어 EC2를 사용했습니다. 

- 처음 배포를 해보았기 때문에 풍부한 문서, 온라인 커뮤니티를 통해 충분히 학습할 수 있는 Ubuntu를 사용했습니다.


✔ AWS-S3

- 높은 내구성과 높은 가용성을 저렴한 가격으로 제공하는 인터넷 스토리지 서비스인 AWS-S3를 사용했습니다.

- AWS-S3를 사용해 유저 이미지와 게시글의 업로드 파일을 저장했습니다.

✔ AWS-ROUTE 53

- 가용성과 확장성이 우수한 DNS(도메인 이름 시스템) 웹 서비스인 Route 53을 사용하여 직접 구입한 도메인 등록, DNS 라우팅 기능을 구현하였습니다.

✔ AWS-IAM

- IAM을 사용하여 S3를 사용하도록 인증(로그인) 및 권한 부여(권한 있음)된 대상을 제어하여 보안을 강화하였습니다.


<br>

### 5.8 Nginx Reverse Proxy

---

<br>

<img src="https://user-images.githubusercontent.com/62149784/110232660-63092b80-7f62-11eb-9ab5-12f6efc37936.png">

✔ 유저가 http로 접속 할 경우 https로 접속하도록 nginx를 next, express 서버 앞 단에 두어 Reverse Proxy를 통해 보안을 강화했습니다.

✔ http의 기본 포트인 80번 포트로 요청이 오면 nginx를 거쳐서 https의 기본 포트인 443번 포트로 redirect 시켜서 요청에 맞게 각각 next, express 서버로 보내줍니다.

<br>

✔ https 설정 코드 (/etc/nginx/nginx.conf)

<br>

<img src="https://user-images.githubusercontent.com/62149784/110234593-ab2e4b00-7f6e-11eb-8fd5-e10e6f842212.jpg">

<br>

### 5.9 Let's Encrypt로 SSL 적용

___

<br>

<img src="https://user-images.githubusercontent.com/62149784/110230233-ddca4a80-7f52-11eb-8254-75be64158c93.jpg">

<br>

✔  snap과 nginx를 통해서 letsencrypt를 설치하고 인증서를 발급받았습니다.

✔ SSL을 통해 개인 정보, 문서, 이미지를 제출하는데 사용된 서식 및 사용자 ID와 암호를 암호화하고 보호하여 보안을 강화했습니다.

<br>

### 5.10 무중단 배포
___

<br>

✔ 노드는 기본적으로 싱글스레드라 단일 코어에서 실행되기 때문에 멀티 코어 시스템을 사용할 수 없는 단점이 있어 이를 해결하기 위해 클러스터(Cluster) 모듈을 통해 단일 프로세스를 멀티 프로세스(Worker)로 늘릴 방법을 제공하는 PM2를 사용해 노드JS 애플리케이션을 무중단으로 운영하도록 구현했습니다.

✔ PM2의 Monitering 기능을 사용해  전체 프로세스에서 발생하는 로그를 터미널을 통해 실시간으로 확인 가능합니다.

<img src="https://user-images.githubusercontent.com/62149784/110235611-6dccbc00-7f74-11eb-8443-9284d7f164b5.jpg">

<img src="https://user-images.githubusercontent.com/62149784/110235613-70c7ac80-7f74-11eb-98b5-db32773382ac.jpg">


<br>



<br>

## 6. How to Run

### 6.1 Frontend

```
# go to directory
$ cd /ProjectFrontend

# install dependencies
$ npm install
$ yarn install

# running localhost 3000 port
$ npm run dev

# build for production and launch server
$ npm run build && npm start
```



<br>

### 6.2 Backend

```
# go to directory
$ cd /ProjectServer

# install dependencies
$ npm install
$ yarn install

# running dev
$ npm run dev

# running production
$ npm run start
```

<br>

## 7. Cooperation & Testing Tool

- github, slack, Postman

<br>

## 8. Contributor

Frontend : 박진호

github : https://github.com/zinozino1

Backend : 조원제

github : https://github.com/onejaejae
