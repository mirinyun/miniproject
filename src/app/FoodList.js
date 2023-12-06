import { useEffect, useState } from "react";
import { SERVER_URL } from "../comm/constants";
import ButtonBlue from "../comm/ButtonBlue"
import Paging from "../comm/Paging";

const FoodList = () => {
    const [foodList, setFoodList] = useState([]);
    const [foodTag, setFoodTag] = useState();
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [postPerPage] = useState(10);
    const indexOfLastPost = page * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage
    
    const handleKeywordChange = (event) => {
        setKeyword(event.target.value)
    }

    const search = () => {
        if(keyword === ''){
            alert('키워드를 입력하세요')
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
    }

    const handlePageChange = (page) => {
        setPage(page);
    };

    useEffect(() => {
        setCurrentPosts(foodList.slice(indexOfFirstPost, indexOfLastPost));
    }, [foodList, page, indexOfFirstPost, indexOfLastPost])

    useEffect(() => {
        let temp = currentPosts
        .map((item) => 
            <tr key={item.id}>
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
        temp.length === 0 
        ? setFoodTag(<tr>
                    <td>쌀밥</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                    <td>00</td>
                </tr>)
        : setFoodTag(temp)
    }, [currentPosts])

    return (
        <div>
            <div className="mx-96">
                <input type="text"
                    name="keyword"
                    id="keyword"
                    onChange={handleKeywordChange}
                />
                <ButtonBlue caption="검색" handleClick={search}/>
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
                    {<Paging page={page} count={foodList.length} setPage={handlePageChange}/>}
                </div>
            </div>
        </div>
    );
}

export default FoodList
