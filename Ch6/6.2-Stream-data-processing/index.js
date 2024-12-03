import CrimeCountPerYear from "./crime-count-per-year-stream.js";
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import CrimesPerArea from "./crimes-per-area-stream.js";
import { descirbeCrimeCount, getTopDangerousCities, getMostCommonCrimeByArea, getLeastCommonCrime } from './functions.js';

const csvParser = parse({ columns: true });
const crimesPerYearStream = new CrimeCountPerYear();
const crimesPerAreaStream = new CrimesPerArea();
const parseStream = createReadStream('london_crime_by_lsoa.csv').pipe(csvParser)

parseStream
.pipe(crimesPerYearStream);

parseStream
.pipe(crimesPerAreaStream);

const crimeCountPerYear = await crimesPerYearStream.getCrimeCountPerYear();
descirbeCrimeCount( Object.entries(crimeCountPerYear) );

const crimesPerArea = await crimesPerAreaStream.getCrimeCountPerArea();
console.log(getTopDangerousCities(10, crimesPerArea));
console.log(getMostCommonCrimeByArea(crimesPerArea));
console.log(getLeastCommonCrime(crimesPerArea));

