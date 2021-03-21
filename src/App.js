import { useState, useEffect } from 'react';

export default function App() {

    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState({translations: {br:'loading'}, flag:'loading', timezones:"loading"});
    const [horario, setHorario] = useState('Loading');
    const [style, setStyle] = useState({
        backgroundImage : 'url("./night.jpg")',
        color:'white'
    });
    
    const fetchData = () => {
        let configObj = {
            method: 'GET',
        }

        fetch("https://restcountries.eu/rest/v2/all?fields=translations;timezones;flag;", configObj)
        .then((response) => response.json())
        .then(json => {
            setCountries([...json]);
            let c = [...json].find(el => el.translations.br === 'Brasil');
            c.timezones = [...c.timezones][2];
            setCountry(c);
        })
        .catch(err => console.log(err))        
    }

    useEffect(() => {
        fetchData();
    },[]);

    useEffect(() => {
        const interval = setInterval(()=>{
            let date = new Date();
            let timezone = [...country.timezones][0];

            let op = timezone.substring(3, 4);
            let num = parseInt(timezone.substring(4, 6), 10);

            switch (op) {
                case '+':
                    date.setHours(date.getUTCHours() + num);
                    break;
                case '-':
                    date.setHours(date.getUTCHours() - num);
                    break;
            }

            setHorario(date.toLocaleTimeString());
        },1000);
        return () => clearInterval(interval);
    }, [country]);

    useEffect(() => {
        let hr = parseInt(horario.substring(0, 2));

        if(hr > 18 || hr < 6)
            setStyle({backgroundImage : 'url("./night.jpg")',
            color:'white'})
        else
            setStyle({backgroundImage : 'url("./day.jpg")',
            color:'black'})
    }, [horario])


    const selectOnChange = (event) => {
        setCountry(countries.find(el => el.translations.br === event.target.value));
    }

    return(
        <div className="container" style={style}>
            <div className="container-search">
                <img src={country.flag}></img>
                <form>
                    <select onChange={selectOnChange} name={country.translations.br} value={country.translations.br}>
                        {
                            countries.map(c => {return <option key={c.translations.br}>{c.translations.br}</option>})
                        }
                    </select>
                </form>
            </div>

            <h2 className="horario">{horario}</h2>
        </div>
    );
}