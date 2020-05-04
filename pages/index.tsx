import Routes from '../data/lines';
import Link from 'next/link';

const Home = ({}) => {
  return <div className="p-12">
    <h1 className="text-2xl">Furlong : estimation de prix de sillons</h1>
    <div className="px-6 py-2">
      <ul className="list-disc">
        {Object.keys(Routes).map(r => <li className="underline">
          <Link href={`/lines/${r}`}>{Routes[r].label}</Link>
          </li>)}
      </ul>
    </div>
  </div>
  ;
};

export default Home;
