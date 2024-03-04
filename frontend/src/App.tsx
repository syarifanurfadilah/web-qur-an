import { useState } from 'react'
import './App.css'
import useFetch from './useFetch'

function App() {
  const [selectedSurah, setSelectedSurah] = useState<string | null>(null)

  const [data, refetch] = useFetch("/api" + (selectedSurah == null ? "" : "/surah/" + selectedSurah))
  const [bookmark, refetchBookmark] = useFetch("/api/bookmark")

  async function booking(surah: string, ayat: string) {
    const inds = (bookmark as any[]).findIndex(el2 => el2.ayat == ayat && surah == el2.surah) 
    if (inds != -1) {
      const bookmarks = bookmark[inds]

      try {
        const feting = await fetch(`/api/bookmark/${bookmarks.id}`, {
          method: "DELETE",
          
        })
        const json = await feting.json()
        if (feting.ok == false) return alert(json.message)
        alert("Berhasil")
        refetchBookmark()
        refetch()

      } catch (err) {
        console.log(err)
        alert("Error")
      }
    }
    else {
      try {
        const feting = await fetch(`/api/bookmark/${surah}/${ayat}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
        })
        const json = await feting.json()
        if (feting.ok == false) return alert(json.message)
        alert("Berhasil")
        refetchBookmark()
        refetch()

      } catch (err) {
        console.log(err)
        alert("Error")
      }
    }
  }


  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#f7f7f7', padding: '2rem', borderRadius: '1rem' }}>
      <h1 style={{ textAlign: 'center', cursor: 'pointer', color: '#333', marginBottom: '2rem', fontSize: '2rem' }} onClick={() => {
        setSelectedSurah(null)
      }}>Alqur'an Website</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1rem",
        justifyContent: 'center'
      }}>
        {data != null && selectedSurah == null ?
          Array.isArray(data) && data?.map((el: any) =>
            <div key={el.nomor} onClick={() => {
              setSelectedSurah(el.nomor)
            }} className="itemsurah" style={{
              padding: "1.5rem",
              borderRadius: ".5rem",
              border: "1px solid #ddd",
              backgroundColor: '#fff',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              cursor: "pointer",
              transition: 'transform 0.3s ease-in-out',
              textAlign: 'center',
              color: '#333'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{el.nomor}</h2>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'normal', margin: '0' }}>{el.namaLatin}</h3>
              <p style={{ margin: '0', fontSize: '1rem' }}>{el.nama}</p>
            </div>)
          :
          data != null && data?.ayat?.map((el: any) =>
            <div key={el.nomorAyat} onClick={() => {
              booking(data.nomor, el.nomorAyat)
            }} className='itemayat' style={{
              padding: "1.5rem",
              borderRadius: ".5rem",
              border: "1px solid #ddd",
              backgroundColor: '#fff',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              cursor: "pointer",
              transition: 'transform 0.3s ease-in-out',
              color: '#333'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{el.nomorAyat}</h2>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'normal', margin: '0', color: '#333' }}>{el.teksArab}</h3>
                <p style={{ margin: '0', fontSize: '1rem', color: '#666' }}>{el.teksLatin}</p>
                <p style={{ margin: '0', fontSize: '1rem', color: '#666' }}>{el.teksIndonesia}</p>
              </div>
            </div>)
        }
      </div>
    </div>
  )
  
  
}

export default App
