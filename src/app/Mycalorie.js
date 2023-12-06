import CircleButton from "../comm/CircleButton"
const Mycalorie = () => {
    const handleClickInsert = () => {
        window.location.replace("/mycalorieinsert")
    }
    const handleClickView = () => {
        window.location.replace("/mycalorieview")
    }

    return (
        <div className="flex py-20 space-x-20 justify-center ">
            <div onClick={handleClickInsert}>
                <CircleButton name="내 식단 입력" color="#AEC3AE" background="white"/>
            </div>
            <div onClick={handleClickView}>
                <CircleButton name="내가 섭취한 칼로리(일별/주별/월별)" color="#EEC759" background="white"/>
            </div>
        </div>
    ); 
}

export default Mycalorie