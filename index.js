let request = new XMLHttpRequest();
let date = new Date();
let curHour = date.getHours();
var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var weatherDict = {
    0: "Clear",
    1: "MainlyClear",
    2: "PartlyCloudy",
    3: "Overcast",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Rain",
    71: "Snow",
    73: "Snow",
    75: "Snow",
    80: "Shower",
    81: "Shower",
    82: "Shower",
    95: "Thunderstorm",
};

request.open("GET", "https://api.open-meteo.com/v1/forecast?latitude=-41.11&longitude=174.87&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=Pacific%2FAuckland")

request.send();

request.onload = () => {
    console.log(request);
    if(request.status ===200){
        console.log(JSON.parse(request.response));
        let curTemp = document.getElementById('curtemp');
        curTemp.innerText = currentTemp(JSON.parse(request.response)) +"°c";
        addHours(JSON.parse(request.response));
        addDays(JSON.parse(request.response));
    }else{
        console.log(`error ${request.status} ${request.statusText}`)
    }
}

function currentTemp(requestObj){  
    return requestObj.hourly.temperature_2m[curHour];
}

function addHours(requestObj){
    for(let i = 0; i< 8; i++){
        const temp = requestObj.hourly.temperature_2m[curHour+i];
        const wc = requestObj.hourly.weathercode[curHour+i];
        addHour(curHour+i, wc, temp);
    }
}

function addHour(hour, wc, temp){
    let hourDiv = document.getElementById('hourly');
    const div =document.createElement('div');
    let anHour = hour > 24 ? hour-24 : (hour>12 ? hour-12 : hour);
    let amPm = hour >= 24 ? 'am' : (hour >= 12 ? 'pm': 'am');
    div.className = 'hours';
    div.innerHTML = `<div class='hourTemp'>${temp}°c</div><img src="images/icons/${weatherDict[wc]}.png" height = 20px> ${anHour}${amPm}`
    hourDiv.appendChild(
        div
    )
}

function addDays(requestObj){
    const day = date.getDay();
    
    for(let i = 0; i< 7; i++){
        const minTemp = requestObj.daily.temperature_2m_min[i];
        const maxTemp = requestObj.daily.temperature_2m_max[i];
        const dayCalc = day+i > 6 ? day+i -6 : day+i;
        const wc = requestObj.daily.weathercode[i];
        addDay((day+i == day ? 'Today' : dayOfWeek[dayCalc]), maxTemp, minTemp, wc);
    }
}

function addDay(day, maxTemp, minTemp, wc){
    let dailyDiv = document.getElementById('daily');
    const div =document.createElement('div');
    div.className = 'day';
    div.innerHTML = `<div class = 'dayInfo' ><div class ='dayText'>${day}</div><div class = 'mm' > ${minTemp}°c &#8652; ${maxTemp}°c</div></div><img class = 'dayIcon' src="images/icons/${weatherDict[wc]}.png" height = 25px>`
    dailyDiv.appendChild(
        div
    )
}
