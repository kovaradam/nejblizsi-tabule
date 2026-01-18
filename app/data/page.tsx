import { getData } from "@/data/get-data";

export default async function Home() {
  const res = await getData();
  return (
    <main className="">
      <table>
        <thead>
          <tr>
            <th>Station</th>
            <th>ID</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {res.map((station) => (
            <tr key={station.id}>
              <td>{station.name}</td>
              <td>{station.id}</td>
              <td>{station.lat}</td>
              <td>{station.lon}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
