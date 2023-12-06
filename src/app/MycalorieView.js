import { useState, useEffect } from "react";
import { SERVER_URL } from "../comm/constants";

const MycalorieView = () => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1 < 10 ? '0' + today.getMonth() + 1 : today.getMonth() + 1 
    const todayDate = today.getDate() < 10 ? '0' + today.getDate() : today.getDate
    const formattedDate = `${today.getFullYear()}-${todayMonth}-${todayDate}`
    const lastYear = `${today.getFullYear() - 1}-${todayMonth}-${todayDate}`
    const [dietList, setDietList] = useState([])
    // const [dailyTag, setDailyTag] = useState()

    let lastWeekOne = new Date()
    lastWeekOne.setDate(today.getDate() - 7);
    const formattedLastWeekOne = lastWeekOne.toISOString().slice(0, 10);
    // const formattedLastWeekTwo = lastWeekOne.setDate(today.getDate() - 6).toISOString().slice(0, 10);

    console.log(formattedLastWeekOne)
    // console.log(formattedLastWeekTwo)

    useEffect(() => {
        fetch(SERVER_URL + 'api/private/memberfoodgetall', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: formattedLastWeekOne + "," + formattedDate + "," + sessionStorage.getItem("username")
        })
        .then(Response => Response.json())
        .then((data) => setDietList(data))
        .catch(err => console.error(err))
    }, [lastYear, formattedDate, formattedLastWeekOne])

    useEffect(() => {
        console.log(dietList)
        const groupedData = dietList.reduce((acc, item) => {
            (acc[item[3]] = acc[item[3]] || []).push(item);
            return acc;
        }, {});
        console.log(groupedData)
        // const temp = dietList.filter((item) => )
        // .map((item) => {
        //     <tr key={item[0]}>
        //         <td>{item[3]}</td>
        //         <td>{item[1].name}</td>
        //         <td>{item[2]}</td>
        //     </tr>
        // })
    }, [dietList])

    return (
        <div>
            <table className="table-auto">
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>총 탄수화물</th>
                            <th>총 단백질</th>
                            <th>총 지방</th>
                            <th>총 칼로리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {}
                    </tbody>
                </table>
        </div>
    )
}

export default MycalorieView