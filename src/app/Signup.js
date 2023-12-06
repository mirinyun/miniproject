import { useState } from "react";
import { SERVER_URL } from "../comm/constants";
import ButtonBlue from "../comm/ButtonBlue"
const Signup = () => {
    const [member, setMember] = useState({
        username: '',
        password: ''
    })

    const [isdouble, setIsdouble] = useState(false);
    const [doubletag, setDoubletag] = useState();
    const [checkpassword, setCheckpassword] = useState('')

    const handleIdChange = (event) => {
        setMember({...member, [event.target.name] : event.target.value})
        setIsdouble(false)
        setDoubletag(<></>)
    }

    const handlePwChange = (event) => {
        setMember({...member, [event.target.name] : event.target.value})
    }

    const handleCheckPassword = (event) => {
        setCheckpassword(event.target.value)
    }

    const handleCheckDouble = () => {
        if(member.username === '') {
            alert('아이디를 입력하세요')
            return
        }
        fetch(SERVER_URL + 'api/public/checkdouble', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: member.username
        })
        .then(Response => Response.body)
        .then((rb) => {
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                //console.log("done", done);
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            //console.log(done, value);
                            push();
                        });
                    }

                    push();
                },
            });
        })
        .then((stream) =>
            // Respond with our stream
            new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
        )
        .then((result) => {
            // Do things with result
            if(result === 'false'){
                setDoubletag(<><div className="text-green-500">사용 가능한 아이디입니다.</div></>)
                setIsdouble(true)
            }
            else{
                setDoubletag(<><div className="text-red-500">이미 존재하는 아이디입니다.</div></>)
            }
        })
        .catch(err => console.error(err))
    }

    const authenticationPassword = (password) => {
        if(password === ''){
            return true
        }
        return false
    }

    const signupSuccess = () => {
        if(!isdouble){
            alert('아이디 중복 확인하세요')
        }
        else if(checkpassword !== member.password){
            alert('비밀번호가 일치하지 않습니다.')
        }
        else if(authenticationPassword(checkpassword)){
            alert('허용되지않는 비밀번호입니다.')
        }
        else{
            fetch(SERVER_URL + 'api/public/signup', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(member)
            })
            .then(Response => {
                return window.location.replace("/login")
            })
            .catch(err => console.error(err))
        }
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
           <div className="flex flex-col items-center justify-center px-6 py-8 mx:flex md:flex lg:py-10">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            회원가입
                        </h1>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">아이디</label>
                                <input type="username"
                                    name="username"
                                    id="username"
                                    placeholder=""
                                    required=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={handleIdChange}/>
                            </div>
                            <ButtonBlue caption="중복확인" handleClick={handleCheckDouble} />
                            {doubletag}
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호</label>
                                <input type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" 
                                    onChange={handlePwChange}/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">비밀번호 확인</label>
                                <input type="password"
                                    name="checkpassword"
                                    id="checkpassword"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" 
                                    onChange={handleCheckPassword}/>
                            </div>
                            <ButtonBlue caption="가입완료" handleClick={signupSuccess} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup
