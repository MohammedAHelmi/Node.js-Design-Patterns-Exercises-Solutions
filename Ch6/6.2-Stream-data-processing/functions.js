export const descirbeCrimeCount = function(points){
    console.log(`In ${points[0][0]} the crime number was ${points[0][1]}`);
    
    let prevYearCount = points[0][1];
    const [first, ...nextYears] = points;

    for(const [year, count] of nextYears){
        const state = prevYearCount > count? 'decreased': 'increased';
        console.log(`In ${year} crimes ${state} to ${count} crime(s)`);
        prevYearCount = count;
    }
}

export const getTopDangerousCities = function(cityCount, cityCrimesMap){
    const crimeCountPerCity = {};

    for(const [city, crimes] of Object.entries(cityCrimesMap)){
        crimeCountPerCity[city] = 0;
        for(const [_, count] of Object.entries(crimes)){
            crimeCountPerCity[city] += count;
        }
    }

    const crimeCountPerCityArray = Object.entries(crimeCountPerCity);
    crimeCountPerCityArray.sort((a, b) => {
        if(b[1] < a[1]) return -1;
        if(b[1] > a[1]) return 1;
        return 0;
    });
    return crimeCountPerCityArray.slice(0, cityCount);
}

export const getMostCommonCrimeByArea = function(cityCrimesMap){
    const mostCommonCrimePerCity = {};

    for(const [city, crimes] of Object.entries(cityCrimesMap)){
        let mostCommonCrime = '';

        for(const [crime, count] of Object.entries(crimes)){
            if(mostCommonCrime === '') mostCommonCrime = crime;

            if(crimes[mostCommonCrime] <= count) continue;

            mostCommonCrime = crime;
        }

        mostCommonCrimePerCity[city] = mostCommonCrime;
    }

    return mostCommonCrimePerCity;
}

export const getLeastCommonCrime = function(cityCrimesMap){
    const crimesCount = {};

    for(const [_, crimes] of Object.entries(cityCrimesMap)){
        for(const [crime, count] of Object.entries(crimes)){
            crimesCount[crime] = crimesCount[crimes] ?? 0;
            crimesCount[crime] += count;
        }
    }

    return Object.entries(crimesCount).reduce((leastCommon, [crime, count]) =>{
        if(leastCommon === '') return crime;
        if(count < crimesCount[leastCommon]) return crime;
        return leastCommon;
    }, '');
}