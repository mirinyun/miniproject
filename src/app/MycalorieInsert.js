import { useEffect, useState, useRef } from "react";
import { SERVER_URL } from "../comm/constants";
import ButtonBlue from "../comm/ButtonBlue"
import ModalSearch from "./ModalSearch";
import ModalUpdate from "./ModalUpdate";

const MycalorieInsert = () => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1 < 10 ? '0' + today.getMonth() + 1 : today.getMonth() + 1 
    const todayDate = today.getDate() < 10 ? '0' + today.getDate() : today.getDate
    const formattedDate = `${today.getFullYear()}-${todayMonth}-${todayDate}`
    const date = useRef()
    const [dietList, setDietList] = useState([]);
    const [dietTag, setDietTag] = useState(<></>)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const foodName = useRef()
    const time = useRef()
    const gram = useRef()
    const [memberFood, setMemberFood] = useState({
        date: formattedDate,
        time: '',
        foodId: '',
        gram: '',
        memberUsername: sessionStorage.getItem('username')
    })
    const [insertFood, setInsertFood] = useState()
    const [updateFood, setUpdateFood] = useState()

    const handleChangeDate = (event) => {
        time.current.value = ''
        foodName.current.value = ''
        gram.current.value = ''
        fetch(SERVER_URL + 'api/private/memberfoodget', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: event.target.value + "," + memberFood.memberUsername
        })
        .then(Response => Response.json())
        .then((data) => setDietList(data))
        .catch(err => console.error(err))
        setMemberFood({...memberFood, [event.target.name] : event.target.value})
    }

    const handleChangeTime = (event) => {
        setMemberFood({...memberFood, [event.target.name] : event.target.value})
    }

    const handleClickName = () => {
        setIsSearchOpen(true)
    }

    const handleChangeGram = (event) => {
        setMemberFood({...memberFood, [event.target.name] : event.target.value})
    }

    const foodInsert = () => {
        let isDuplicate = false
        if(time.current.value === undefined || time.current.value === ''){
            alert('시간을 입력하세요')
            return
        }
        if(foodName.current.value === undefined || foodName.current.value === ''){
            alert('음식이름을 입력하세요')
            return
        }
        if(isNaN(gram.current.value) || gram.current.value === ''){
            alert('그램에 숫자를 입력하세요')
            return
        }
        dietList.map((item) => {if(time.current.value === item[3] && foodName.current.value === item[1].name){
                isDuplicate = true
            }
            return item
        })
        if(isDuplicate) {
            alert('같은 시간 같은 음식은 추가할 수 없습니다.')
            return
        }
        fetch(SERVER_URL + 'api/private/memberfoodinsert', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify(memberFood)
        })
        .then(Response => {
            let tempList = dietList.map((item) => item)
            const temp = [time.current.value+insertFood.name,insertFood,gram.current.value,time.current.value,'']
            tempList.push(temp)
            setDietList(tempList)
        })
        .catch(err => console.error(err))
    }

    useEffect(() => {
        date.current.value = formattedDate
        fetch(SERVER_URL + 'api/private/memberfoodget', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: formattedDate + "," + sessionStorage.getItem("username")
        })
        .then(Response => Response.json())
        .then((data) => setDietList(data))
        .catch(err => console.error(err))
    }, [formattedDate])

    useEffect(() => {
        const temp = dietList
        .sort((a, b) => parseInt(a[3].split(':')[0]) - parseInt(b[3].split(':')[0]) === 0 ? parseInt(a[3].split(':')[1]) - parseInt(b[3].split(':')[1]) : parseInt(a[3].split(':')[0]) - parseInt(b[3].split(':')[0]))
        .map((item) => 
            <tr className="hover:bg-gray-400" key={item[0]} onClick={() => {setIsUpdateOpen(true)
                                                                              setUpdateFood(item)}}>
                <td>{item[3]}</td>
                <td>{item[1].name}</td>
                <td>{item[2]}</td>
            </tr>
        )
        setDietTag(temp)
    }, [dietList])

    return (
        <div>
            <div className="text-5xl mx-96 mb-3">내 식단 입력</div>
            <div className="mx-96">
                <div>날짜 입력</div>
                <input ref={date} type="date" id="date" name="date" onChange={handleChangeDate}/>
            </div>
            <div className="flex justify-center">
                <div className="flex m-5">
                    <div>시간 입력</div>
                    <input ref={time} type="time" id="time" name="time" onChange={handleChangeTime}/>
                </div>
                <div className="flex m-5">
                    <div>음식 이름</div>
                    <input ref={foodName} type="text" id="name" name="name" placeholder="클릭하세요" readOnly onClick={handleClickName}/>
                    <ModalSearch isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} foodName={foodName} memberFood={memberFood} setMemberFood={setMemberFood} setInsertFood={setInsertFood}/>
                </div>
                <div className="flex m-5">
                    <div>그램수</div>
                    <input ref={gram} type="text" id="gram" name="gram" onChange={handleChangeGram}/>
                </div>
                <div className="flex m-5">
                    <ButtonBlue caption='추가' handleClick={foodInsert}/>
                </div>
            </div>
            <div className="mx-40 my-10">
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>시간</th>
                            <th>음식이름</th>
                            <th>그램수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dietTag}
                    </tbody>
                </table>
                {date.current === undefined ? <></> : <ModalUpdate isOpen={isUpdateOpen} setIsOpen={setIsUpdateOpen} date={date} updateFood={updateFood} dietList={dietList} setDietList={setDietList}/>}
            </div>
        </div>
    ); 
}

export default MycalorieInsert