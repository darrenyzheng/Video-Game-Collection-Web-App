import usFlag from '../flags/us.svg';
import jpFlag from '../flags/jp.svg';
import brFlag from '../flags/br.svg';
import globalFlag from '../flags/global.svg';
import euFlag from '../flags/eu.webp';

const platformDict = new Map();

platformDict.set(1, { country: 'Europe', flag: euFlag });
platformDict.set(2, { country: 'North America', flag: usFlag });
platformDict.set(3, 'Australia');
platformDict.set(4, 'New Zealand');
platformDict.set(5, { country: 'Japan', flag: jpFlag });
platformDict.set(6, 'China');
platformDict.set(7, 'Asia');
platformDict.set(8, { country: 'Worldwide', flag: globalFlag });
platformDict.set(9, 'Korea');
platformDict.set(10, { country: 'Brazil', flag: brFlag });

export default platformDict;
