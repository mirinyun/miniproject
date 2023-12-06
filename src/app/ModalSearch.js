import { useEffect, useState } from "react";
import ReactModal from "react-modal"
import { SERVER_URL } from "../comm/constants";
import Paging from "../comm/Paging";
const Modal = ({isOpen, setIsOpen, foodName, memberFood, setMemberFood, setInsertFood}) => {
    const [foodList, setFoodList] = useState([]);
    const [foodTag, setFoodTag] = useState();
    const [keyword, setKeyword] = useState();
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0)
    const [currentPosts, setCurrentPosts] = useState([]);
    const [postPerPage] = useState(10);
    const indexOfLastPost = page * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage

    const handleKeywordChange = (event) => {
        setKeyword(event.target.value)
    }

    const handlePageChange = (page) => {
        setPage(page);
    };

    useEffect(() => {
        if(keyword === '' || keyword === undefined){
            return
        }
        fetch(SERVER_URL + 'api/public/search', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: keyword
        })
        .then(Response => Response.json())
        .then(data => setFoodList(data))
        .catch(err => console.error(err))
        setPage(1)
    }, [keyword])

    useEffect(() => {
        setCurrentPosts(foodList.slice(indexOfFirstPost, indexOfLastPost));
        setCount(foodList.length)
    }, [foodList, page, indexOfFirstPost, indexOfLastPost])

    useEffect(() => {
        let temp = currentPosts
        .map((item) => 
            <tr className="hover:bg-gray-400" key={item.id} onClick={() => {
                foodName.current.value = item.name
                setMemberFood({...memberFood, 'foodId' : item.id})
                setInsertFood(item)
                setIsOpen(false)
            }}>
                <td>{item.name}</td>
                <td>{item.carbohydrates}</td>
                <td>{item.protein}</td>
                <td>{item.fat}</td>
                <td>{item.sugar}</td>
                <td>{item.sodium}</td>
                <td>{item.cholesterol}</td>
                <td>{item.saturatedfattyacids}</td>
                <td>{item.transfattyacids}</td>
                <td>{item.calorie}</td>
            </tr>
        )
        setFoodTag(temp)
    }, [currentPosts, foodName, setIsOpen, memberFood, setMemberFood, setInsertFood])

    useEffect(() => {
        if(isOpen === true){
            setFoodTag(<></>)
            setCount(0)
        }
    }, [isOpen])

    return (
        <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
            <div className="mx-96">
                <input type="text"
                    name="keyword"
                    id="keyword"
                    onChange={handleKeywordChange}
                />
            </div>
            <div className="mx-10 my-5">
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>음식</th>
                            <th>탄수화물(g)</th>
                            <th>단백질(g)</th>
                            <th>지방(g)</th>
                            <th>당류(g)</th>
                            <th>나트륨(mg)</th>
                            <th>콜레스테롤(mg)</th>
                            <th>포화지방산(g)</th>
                            <th>트랜스지방산(g)</th>
                            <th>열량(kcal)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodTag}
                    </tbody>
                </table>
                <div>
                    {<Paging page={page} count={count} setPage={handlePageChange}/>}
                </div>
            </div>
            <button onClick={() => setIsOpen(false)}>닫기</button>
        </ReactModal>
    )
}

export default Modal