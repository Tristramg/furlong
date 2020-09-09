import pandas
import re
from pathlib import Path

p = Path('.')
count = 0

from sqlalchemy import create_engine
cnx = 'postgresql://LOGIN:PASSWORD@routing.midnight-trains.com:5432/furlong'
engine = create_engine(cnx, echo=False, executemany_mode='batch')

airports = re.compile('.*,.*,.._(....)_.._(....)')

for f in list(p.glob('avia_par_*.tsv')):
    print(f)
    data = pandas.read_csv(f, sep='\t', na_values=": ").rename(columns={'unit,tra_meas,airp_pr\\time': 'head'})

    # Only keep departure passenger
    data = data[data['head'].str.contains('PAS_CRD_DEP')]

    # Let’s remove everything where there is less than 100 000 travels in data
    data = data[data['2018 '] > 100000]

    # Extract departure and arrival airport
    head = data['head']
    data['from'] = head.apply(lambda x: airports.match(x).group(1))
    data['to'] = head.apply(lambda x: airports.match(x).group(2))
    data.drop(['head'], axis=1, inplace=True)

    # We only keep monthly data (not quartely, nor annual)
    month = data.filter(like='M').fillna(0)
    month['from'] = data['from']
    month['to'] = data['to']

    data = pandas.melt(month, id_vars=['from', 'to'], value_name='departing_carried_passengers')
    data['year'] = data['variable'].apply(lambda x: x.split('M')[0])
    data['month'] = data['variable'].apply(lambda x: x.split('M')[1])
    data.drop(['variable'], axis=1, inplace=True)

    # Let’s remove when the value is null
    data = data[data['departing_carried_passengers'] > 0]

    data.to_sql('eurostat_avia_par', engine, if_exists='append', chunksize=100, method='multi')

    count += data.shape[0]


print(count)
