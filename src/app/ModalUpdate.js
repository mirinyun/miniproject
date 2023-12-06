import ReactModal from "react-modal"
import { SERVER_URL } from "../comm/constants"
import { useState,useEffect, useRef } from "react"
const ModalUpdate = ({isOpen, setIsOpen, date, updateFood, dietList, setDietList}) => {
    const [memberFood, setMemberFood] = useState({
        date: '',
        time: '',
        foodId: '',
        gram: '',
        comment: '',
        memberUsername: ''
    })
    const [isUpdate, setIsUpdate] = useState(false)
    const gram = useRef()
    const comment = useRef()
    const [foodGram,setFoodGram] = useState()
    const [foodComment,setFoodComment] = useState()

    const handleDelete = () => {
        if (window.confirm("삭제하시겠습니까?")) {
            fetch(SERVER_URL + 'api/private/memberfooddelete', {
                method: 'DELETE',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(memberFood)
            })
            .then(Response => {
                let temp = dietList.map((item) => item)
                temp = temp.filter((item) => item[1].id !== memberFood.foodId || item[3] !== memberFood.time)
                setDietList(temp)
                setIsOpen(false)
            })
            .catch(err => console.error(err))

        } else {}
    }

    const handleUpdate = () => {
        setIsUpdate(true)
    }

    const handleConfirm = () => {
        if((foodGram === undefined && foodComment === undefined) || (foodGram === memberFood['gram'] && foodComment === memberFood['comment']) || (foodGram === memberFood['gram'] && foodComment === undefined) || (foodGram === undefined && foodComment === memberFood['comment'])) {
            alert('수정한 내용이 없습니다.')
            return
        }
        if(foodGram !== undefined && (isNaN(foodGram) || foodGram === '')){
            alert('그램에 숫자를 입력하세요')
            return
        }
        if (window.confirm("수정하시겠습니까?")) {
            fetch(SERVER_URL + 'api/private/memberfoodupdate', {
                method: 'PUT',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({
                    date: memberFood['date'],
                    time: memberFood['time'],
                    foodId: memberFood['foodId'],
                    gram: foodGram === undefined ? null : foodGram,
                    comment: foodComment === undefined ? null : foodComment,
                    memberUsername: memberFood['memberUsername']
                })
            })
            .then(Response => {
                let temp = dietList.map((item) => item)  
                if(foodGram !== undefined && foodComment !== undefined){
                    gram.current.value = foodGram
                    comment.current.value = foodComment
                    setMemberFood({...memberFood, 'gram' : foodGram, 'comment' : foodComment})
                    temp = temp.map((item) => {
                        if(item[1].id === memberFood.foodId && item[3] === memberFood.time) {
                            item[2] = foodGram
                            item[4] = foodComment
                            return item
                        }
                        else return item
                    })
                }
                else if(foodGram !== undefined){
                    gram.current.value = foodGram
                    setMemberFood({...memberFood, 'gram' : foodGram})
                    temp = temp.map((item) => {
                        if(item[1].id === memberFood.foodId && item[3] === memberFood.time) {
                            item[2] = foodGram
                            return item
                        }
                        else return item
                    })
                }
                else{
                    comment.current.value = foodComment
                    setMemberFood({...memberFood, 'comment' : foodComment})
                    temp = temp.map((item) => {
                        if(item[1].id === memberFood.foodId && item[3] === memberFood.time) {
                            item[4] = foodComment
                            return item
                        }
                        else return item
                    })
                }
                setDietList(temp)
                setIsUpdate(false)
            })
            .catch(err => console.error(err))

        } else {}
    }

    const handleCancle = () => {
        setIsUpdate(false)
    }

    const handleChangeGram = (event) => {
        setFoodGram(event.target.value)
    }

    const handleChangeComment = (event) => {
        setFoodComment(event.target.value)
    }

    useEffect(() => {
        if(updateFood === undefined) return
        setMemberFood({'date' : date.current.value , 'time' : updateFood[3] , 'foodId' : updateFood[1].id, 'gram' : updateFood[2], 'comment' : updateFood[4], 'memberUsername' : sessionStorage.getItem('username')})
    }, [isOpen, updateFood, date])

    useEffect(() => {
        if(!isUpdate) {
            setFoodComment(undefined)
            setFoodGram(undefined)
            return
        }
        gram.current.value = memberFood['gram']
        comment.current.value = memberFood['comment']
    }, [isUpdate, memberFood])

    if (updateFood === undefined) return <></>
    else{
        return (
            <ReactModal isOpen={isOpen} onRequestClose={() => {setIsOpen(false)
                                                               setIsUpdate(false)}}>
                <div className="">
                    <div className="flex">
                        <div>
                            음식이름 : 
                        </div>
                        <div>
                            {updateFood[1].name}
                        </div>
                    </div>
                    <div className="flex">
                        <div>
                            시간 :
                        </div>
                        <div>
                            {updateFood[3]}
                        </div>
                    </div>
                    <div className="flex">
                        <div>
                            그램수 : 
                        </div>
                        <div>
                            {isUpdate ? <input ref={gram} type="text" id="gram" name="gram" onChange={handleChangeGram}/> : updateFood[2]}
                        </div>
                    </div>
                    <div className="">
                        <div>
                            comment
                        </div>
                        <div>
                            {isUpdate
                            ?<textarea ref={comment} id="comment" name="comment" onChange={handleChangeComment} rows="5" cols="33">
                            </textarea>
                            :<textarea ref={comment} id="comment" name="comment" rows="5" cols="33" readOnly={true} defaultValue={updateFood[4]}/>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex">
                    {isUpdate 
                    ? <><button onClick={handleConfirm}>확인</button>
                    <button onClick={handleCancle}>취소</button></>
                    : <><button onClick={handleUpdate}>수정</button>
                    <button onClick={handleDelete}>삭제</button>
                    <button onClick={() => {setIsOpen(false)}}>닫기</button></>}
                    
                </div>
            </ReactModal>
        )
    }
}

export default ModalUpdate