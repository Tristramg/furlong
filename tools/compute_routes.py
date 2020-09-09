import psycopg2
import requests

cnx = 'postgresql://LOGIN:PASSWORD@routing.midnight-trains.com:5432/furlong'
conn = psycopg2.connect(cnx)

def route(from_name, to_name, from_lon, from_lat, to_lon, to_lat):
  query = f"http://routing.midnight-trains.com:5000/route/v1/driving/{from_lon},{from_lat};{to_lon},{to_lat}?overview=full"
  r = requests.get(query)
  if r.ok:
    json = r.json()
    if json["routes"] and len(json["routes"]) > 0:
      route = json["routes"][0]
      length = route["distance"] / 1000
      geom = route["geometry"]
      return (length, geom)
    else:
      print(f"No route found {from_name}-{to_name}")
  else:
    print(f"error {from_name}-{to_name} {query}")



query = """SELECT
    sum(one_way.departing_carried_passengers + return_way.departing_carried_passengers) as total,
    sum(one_way.departing_carried_passengers) as parting_pax,
    sum(return_way.departing_carried_passengers) as returning_pax,
    from_airport.city as from_name, to_airport.city as to_name, one_way.year,
    round(avg(earth_distance(ll_to_earth(from_airport.latitude, from_airport.longitude), ll_to_earth(to_airport.latitude, to_airport.longitude)))/1000) as distance,
    AVG(from_airport.longitude) as from_longitude, AVG(from_airport.latitude) as from_latitude,
    AVG(to_airport.longitude) as to_longitude, AVG(to_airport.latitude) as to_latitude
FROM eurostat_avia_par as one_way, eurostat_avia_par as return_way, airports as from_airport, airports as to_airport
WHERE
    from_airport.icao = one_way.from AND to_airport.icao = one_way.to
    AND one_way.year = '2018'
    AND one_way.year = return_way.year AND one_way.month = return_way.month
    AND one_way.from = return_way.to AND one_way.to = return_way.from

GROUP BY one_way.year, from_name, to_name
HAVING round(avg(earth_distance(ll_to_earth(from_airport.latitude, from_airport.longitude), ll_to_earth(to_airport.latitude, to_airport.longitude)))/1000) < 2000
ORDER BY total DESC"""

cur = conn.cursor()
cur.execute(query)

w = conn.cursor()
w.execute("DROP TABLE IF EXISTS potential_routes")
w.execute("CREATE TABLE potential_routes (from_name text, to_name text, passengers integer, geom geometry(linestring, 4326), rail_distance float, crow_distance float)")

for r in cur.fetchall():
  (total, parting_pax, returning_pax, from_name, to_name, year, distance, from_longitude, from_latitude, to_longitude, to_latitude) = r
  r = route(from_name, to_name, from_longitude, from_latitude, to_longitude, to_latitude)

  if r:
    (length, geom) = r
    w.execute("INSERT INTO potential_routes (from_name, to_name, passengers, geom, rail_distance, crow_distance) VALUES(%s, %s, %s, ST_LineFromEncodedPolyline(%s), %s, %s)",
      (from_name, to_name, total, geom, length, distance))
    print(f"{from_name}, {to_name}")

w.execute("delete from potential_routes where to_name in ('Tenerife', 'Gran Canaria', 'Ibiza', 'Palma de Mallorca');")
w.execute("delete from potential_routes where from_name in ('Tenerife', 'Gran Canaria', 'Ibiza', 'Palma de Mallorca');")
conn.commit()
conn.close()
