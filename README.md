# Voice 프로젝트

Voice(가칭)는 speech-to-text, text-to-speech를 지원하는 신개념 채팅 솔루션입니다.

## 주요 기능

* 유저 프로필 설정
* 친구 추가
* 게시물 및 댓글 CRUD
* '좋아요' 기능
* 그룹

## 기술 스택

Voice 프로젝트에서는 다음과 같은 기술 스택을 사용합니다.

* Frontend: React.js + Redux + Socket.io
* Backend: Node.js
* Database: mongoDB
* Hosting: Firebase

## 참여자

SynCoder 프로젝트의 참여자는 총 4명입니다.

* 기노현(HUFSCODE)
* 김성현(shkim-std)
* 김현호(JerraldKim)
* 이정주(pyville)

# 튜토리얼

Voice를 튜토리얼입니다.

## 시작하기

로컬 환경에서 Voice를 실행하는 방법은 다음과 같습니다. 

1. Repository를 Clone합니다.
    ```bash
    git clone {REPOSITORY_NAME}
    ```
2. 해당 경로로 이동합니다.
    ```bash
    cd {PATH_NAME}
    ```
3. 개발 모드에서 React App을 실행합니다.
    ```bash
    npm start
    ```
4. [localhost](http://127.0.0.1:3000/)를 엽니다.

## ESLint 실행하기 

1. 코드를 작성한 후, ESLint를 실행하여 코드 오류를 확인하고 컨벤션을 바로잡습니다.
    ```bash
    npm run lint
    ```
