const http = require('http')
const url = require('url')
const { google } = require('googleapis')
const axios = require('axios')
const serviceAccount = require('./serviceAccountKey.json')
const hostname = '127.0.0.1'
const port = 8000
const baseURL = `https://team-a-voice-default-rtdb.firebaseio.com/`
// 모든 사용자 조회 API
// const getUserList = (appKey) =>
//     axios
//         .get(`${baseURL}/users.json?access_token=${appKey}`)
//         .then((res) => res.data)
//         .catch(console.error)
// 특정 사용자 조회 API
const getUser = (userId, appKey) =>
    axios
        .get(`${baseURL}/users/${userId}.json?access_token=${appKey}`)
        .then((res) => res.data)
        .catch(console.error)
// 사용자 삭제 API
// const deleteUser = (userId, appKey) =>
//     axios
//         .delete(`${baseURL}/users/${userId}.json?access_token=${appKey}`)
//         .then((res) => res.data)
//         .catch(console.error)
// 채팅방 목록 (ID) 조회 API
const getChatroomList = (userId, appKey) =>
    axios
        .get(
            `${baseURL}/members.json?access_token=${appKey}&orderBy="userId"&equalTo="${userId}"`
        )
        .then((res) => res.data)
        .catch(console.error)
// 특정 채팅방 조회 API
const getChatroom = (chatroomId, appKey) =>
    axios
        .get(`${baseURL}/chatrooms/${chatroomId}.json?access_token=${appKey}`)
        .then((res) => res.data)
        .catch(console.error)
// 채팅방 삭제 API
// const deleteChatroom = (chatroomId, appKey) =>
//     axios
//         .delete(`${baseURL}/chatrooms/${chatroomId}.json?access_token=${appKey}`)
//         .then((res) => res.data)
//         .catch(console.error)
// 특정 채팅방의 메시지 조회 API
const getMessages = (chatroomId, appKey) =>
    axios
        .get(
            `${baseURL}/messages.json?access_token=${appKey}&orderBy="chatroomId"&equalTo="${chatroomId}"`
        )
        .then((res) => res.data)
        .catch(console.error)
// user 추가 API
const addUser = (nickname, email, mobile, appKey) => {
    const newUser = {
        nickname,
        email,
        mobile,
        createdAt: new Date(),
        lastLoginedAt: new Date(),
    }
    return axios
        .post(`${baseURL}/users.json?access_token=${appKey}`, newUser)
        .then((res) => res.data?.name)
        .catch(console.error)
}
// 채팅방 추가 API
const addChatroom = async (userId, invites, appKey) => {
    const members = [userId, ...invites]
    const newChatroom = {
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    const chatroomId = await axios
        .post(`${baseURL}/chatrooms.json?access_token=${appKey}`, newChatroom)
        .then((res) => res.data?.name)

    return Promise.all(
        members.map((memberId) =>
            axios.post(`${baseURL}/members.json?access_token=${appKey}`, {
                chatroomId,
                memberId,
            })
        )
    ).catch(console.error)
}
// 채팅방에 초대 API
const inviteMember = (memberId, chatroomId, appKey) => {
    return axios
        .post(`${baseURL}/members.json?access_token=${appKey}`, {
            chatroomId,
            memberId,
        })
        .then((res) => res.data?.name)
        .catch(console.error)
}
// 채팅방에서 퇴장 API
// const kickMember = (memberId, chatroomId, appKey) => {
//     return axios
//         .delete(`${baseURL}/members.json?access_token=${appKey}`, {
//             chatroomId,
//             memberId,
//         })
//         .then((res) => res.data?.name)
//         .catch(console.error)
// }
// 메시지 추가 API
const addMessage = (userId, chatroomId, body, appKey) => {
    const newMessage = {
        userId,
        chatroomId,
        body,
        createdAt: new Date(),
    }
    return axios
        .post(`${baseURL}/messages.json?access_token=${appKey}`, newMessage)
        .then((res) => res.data?.name)
        .catch(console.error)
}

const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/firebase.database',
    ]
)

// serviceAccountKey를 이용해 Access Token을 발급합니다.
jwtClient.authorize((error, tokens) => {
    if (error) {
        console.log('Error making request to generate access token:', error)
    } else if (tokens.access_token === null) {
        console.log(
            'Provided service account does not have permission to generate access tokens'
        )
    } else {
        const accessToken = tokens.access_token
        const server = http.createServer((req, res) => {
            const { method } = req
            const [path, query] = [
                url.parse(req.url).pathname,
                url.parse(req.url, true).query,
            ]
            // POST일 때는 request body 데이터 받음
            switch (path) {
                case '/api/users':
                    switch (method) {
                        case 'GET':
                            if (query.userId) {
                                getUser(query.userId, accessToken).then(
                                    (data) => {
                                        res.statusCode = 200
                                        res.setHeader(
                                            'Content-Type',
                                            'application/json; charset=utf-8'
                                        )
                                        res.setHeader(
                                            'Access-Control-Allow-Origin',
                                            '*'
                                        )
                                        res.end(JSON.stringify(data))
                                    }
                                )
                            }
                            break
                        case 'POST': {
                            let temp = ''
                            req.on('data', (data) => {
                                temp += data
                            })
                            req.on('end', () => {
                                const body = JSON.parse(temp)
                                if (
                                    !body.nickname ||
                                    !body.email ||
                                    !body.mobile
                                ) {
                                    console.error(`Bad Request`)
                                    res.statusCode = 400
                                    res.end()
                                } else {
                                    addUser(
                                        body.nickname,
                                        body.email,
                                        body.mobile,
                                        accessToken
                                    ).then(() => {
                                        res.statusCode = 200
                                        res.end()
                                    })
                                }
                            })
                            break
                        }
                        default:
                    }
                    break
                case '/api/chatrooms':
                    switch (method) {
                        case 'GET':
                            if (!query.userId) {
                                console.error(`Bad Request`)
                                res.statusCode = 400
                                res.end()
                            } else {
                                getChatroomList(query.userId, accessToken).then(
                                    (data) => {
                                        res.statusCode = 200
                                        res.setHeader(
                                            'Content-Type',
                                            'application/json; charset=utf-8'
                                        )
                                        res.setHeader(
                                            'Access-Control-Allow-Origin',
                                            '*'
                                        )
                                        res.end(JSON.stringify(data))
                                    }
                                )
                            }
                            break
                        case 'POST': {
                            let temp = ''
                            req.on('data', (data) => {
                                temp += data
                            })
                            req.on('end', () => {
                                const body = JSON.parse(temp)
                                if (!body.userId || !body.invites) {
                                    console.error(`Bad Request`)
                                    res.statusCode = 400
                                    res.end()
                                } else {
                                    addChatroom(
                                        body.userId,
                                        body.invites,
                                        accessToken
                                    ).then(() => {
                                        res.statusCode = 200
                                        res.end()
                                    })
                                }
                            })
                            break
                        }
                        default:
                    }
                    break
                case '/api/messages':
                    switch (method) {
                        case 'GET':
                            getMessages(query.chatroomId, accessToken).then(
                                (data) => {
                                    res.statusCode = 200
                                    res.setHeader(
                                        'Content-Type',
                                        'application/json; charset=utf-8'
                                    )
                                    res.setHeader(
                                        'Access-Control-Allow-Origin',
                                        '*'
                                    )
                                    res.end(JSON.stringify(data))
                                }
                            )
                            break
                        case 'POST': {
                            let temp = ''
                            req.on('data', (data) => {
                                temp += data
                            })
                            req.on('end', () => {
                                const body = JSON.parse(temp)
                                if (!body.userId || !body.postId) {
                                    console.error(`Bad Request`)
                                    res.statusCode = 400
                                    res.end()
                                }
                                addMessage(
                                    body.userId,
                                    body.chatroomId,
                                    body.body ?? `새로운 메시지입니다.`,
                                    accessToken
                                ).then(() => {
                                    res.statusCode = 200
                                    res.end()
                                })
                            })
                            break
                        }
                        default:
                    }
                    break
                default:
            }
        })
        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`)
        })
    }
})
