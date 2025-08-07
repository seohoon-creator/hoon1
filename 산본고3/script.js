function fetchMeal() {
  const dateInput = document.getElementById("datePicker").value;
  const mealInfoDiv = document.getElementById("mealInfo");

  if (!dateInput) {
    mealInfoDiv.textContent = "날짜를 선택해주세요.";
    return;
  }

  const formattedDate = dateInput.replace(/-/g, '');
  const apiURL = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530079&MLSV_YMD=${formattedDate}`;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("API 요청 실패");
      }
      return response.text();
    })
    .then((xmlText) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const mealNodes = xmlDoc.getElementsByTagName("row");
      if (mealNodes.length === 0) {
        mealInfoDiv.textContent = "해당 날짜의 급식 정보가 없습니다.";
        return;
      }

      const meal = mealNodes[0].getElementsByTagName("DDISH_NM")[0].textContent;
      const formattedMeal = meal
        .replace(/<br\/>/g, "\n")
        .replace(/\./g, "") // 알레르기 숫자 제거
        .replace(/\d+/g, "")
        .trim();

      mealInfoDiv.textContent = formattedMeal;
    })
    .catch((error) => {
      mealInfoDiv.textContent = "데이터를 불러오는 중 오류가 발생했습니다.";
      console.error(error);
    });
}
