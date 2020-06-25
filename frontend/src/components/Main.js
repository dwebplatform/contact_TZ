
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import '../styles.css';
import {useDispatch} from 'react-redux';
import { API_URL} from '../assets';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export const Preloader = () => {
    return <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center'
    }}> <div className="spinner-border" style={{
        margin: '0 auto'
    }} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>;
}


function isRedacted(id, user) {
    return id == user.id;
}
export const Main = () => {

    const [allUsers, setAllUsers] = useState([]);
    const [filterUsers,setFilterUsers] = useState([]);
    const [isFiltered, setFiltered] = useState(false);
    const [filterField, setFilterField] = useState('');

    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const dispatch = useDispatch();
    const [paginationData, setPag] = useState({
        beginPage: 0,
        endPage: 10,
        step: 5
    });
    const [redactedUserId, setRedactedUserId] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        id: null,
        name: "",
        phone_number:""

    });

    const [addPatientData, setaddpatientData] = useState({
        name: "",
        phone_number:""
    });


    const handleLogOut=()=>{
        dispatch({
            type:"LOGOUT",

        });
    }


    const makeFiltration=()=>{
        let all_users = [...allUsers];
        // фильтруем по имени
        let filtered_user = all_users.filter(item=>item.name.indexOf(filterField)!==-1);
        if(filtered_user.length)
        {setFiltered(true);
            setFilterUsers([...filtered_user]);
        }
        else {
            setFiltered(false);

        }
    }

    const addHandler = (e) => {
        // поля для нового пациента
        let curKey = e.target.name;
        let value = e.target.value;
        setaddpatientData((prevVar) => {
            return {
                ...prevVar,
                [curKey]: value
            }
        })

    };

    const handleDeleteRequest=(patient_id)=>{
        fetch(`${API_URL}/delete_contact/${patient_id}`,
        {

            method:"POST",
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('secret_token')}`
            }
        })
        .then(res=>res.json())
        .then(data=>{

            console.log(data);
            if(!data.error){
                document.location.reload();
            }
        })
    }
    const addRequest = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization':`Bearer ${localStorage.getItem('secret_token')}`

            },
            body: JSON.stringify(addPatientData)
        }).then(res => res.json())
            .then((data) => {
                console.log(data);

                setLoading(false);
                if (!data.error) {
                    document.location.reload();
                }
                setError(true);
            })
    }
    const updateHandler = (e) => {
        let curKey = e.target.name;
        let value = e.target.value;
        setUpdatedData((prevVar) => {
            return {
                ...prevVar,
                [curKey]: value
            }
        })
    }

    const updateRequest = () => {

        setLoading(true);
        fetch(`${API_URL}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(updatedData)
        }).then(res => res.json())
            .then((data) => {

                setLoading(false);
                if (!data.error) {
                    document.location.reload();
                }
                setError(true);

            })
    }


    useEffect(() => {
        fetch(`${API_URL}/all`,{
            method:"GET",
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('secret_token')}`
            }
        }).then(res => res.json())
            .then((data) => {
                
                setLoading(false);
                if (!data.error) {

                    let curData = [...data.body];
                    setPag((prevPag) => {
                        return {
                            ...prevPag,
                            endPage: Math.ceil(data.body.length / prevPag.step),
                            curPage: 0
                        }
                    })
                    setAllUsers(data.body);

                }
                else {
                    setError(true);
                }

            })
    }, []);
    return (<div className="App">
        <div className="logout">
            <button className="btn btn-dark"
                style={{
                    margin:"10px 20px",
                    
                    width:'200px'
                }}
            onClick={handleLogOut}
            >Выйти</button>
        </div>
        <h3 style={{
            margin: '10px 20px'
        }}> список контактов:</h3>
        <div style={{
            display:'flex',
            width:'100%',
            justifyContent:'center'
        }}>
            <input type="text" 
            style={{
                margin:'0px 20px 10px 0'
            }}
             value={filterField}
             onChange={(e)=>{
                 setFilterField(e.target.value);
             }}
            />
            <button style={{
                margin:'0 0 10px 0'
            }} className="btn btn-dark"
            onClick={(e)=>{
                makeFiltration();
            }}
            >Отфильтровать по имени</button>
        </div>
         <div style={{
            width: '100%',
            textAlign: 'center'
        }}>
         </div>
        <table className="table">

            <thead>
                <tr>
                    <th scope="col">#</th>
                    
                    
                    <th scope="col">Имя </th>
                    <th scope="col">Телефон</th>
                </tr>
            </thead>

            {!isLoading && <tbody>

                {(() => {
                    if(filterUsers.length && isFiltered){
                        return filterUsers.slice(paginationData.beginPage, paginationData.beginPage + paginationData.step).map((item) => {

                            return <tr key={item.id} className={item.has_tested ? 'table-success' : item.has_hospitilized ? 'table-danger' : ''}>
                                <th scope="row"
                                    data-id={item.id}
                                    style={{
                                        display:'flex',
                                        justifyContent:'flex-start',
                                    }}
                                >{
                                    <button type="button"
                                        onClick={(e)=>{
                                            handleDeleteRequest(item.id)
                                        }}
                                        style={{
                                            margin:'0 10px'
                                        }}
                                    className="btn btn-danger">X</button>
                                }
                                    {!isRedacted(redactedUserId, item) && <button className="btn btn-light"
                                        onClick={(e) => {
                                            setUpdatedData({
                                                id: item.id,
                                                name: item.name,
                                                
                                                has_hospitilized: Boolean(item.has_hospitilized),
                                                has_tested: Boolean(item.has_tested)
                                            });
                                            !isRedacted(redactedUserId, item) ?
                                                setRedactedUserId(item.id) : setRedactedUserId(null);


                                        }}
                                    >
                                        Отредактировать</button>}
                                    {isRedacted(redactedUserId, item)
                                        && <button className="btn btn-warning"
                                            onClick={(e) => updateRequest()}
                                        >Закончить редактирование</button>
                                    }
                                </th>
                                <td>{!isRedacted(redactedUserId, item) && item.name}
                                    {
                                        isRedacted(redactedUserId, item) ? <input

                                            type="text"
                                            value={updatedData.name}
                                            name="name"
                                            onChange={(e) => { updateHandler(e) }}
                                        /> : null
                                    }

                                </td>
                                <td>{!isRedacted(redactedUserId, item) && item.phone_number}
                                    {
                                        isRedacted(redactedUserId, item) ? <input

                                            type="text"
                                            value={updatedData.phone_number}
                                            name="phone_number"
                                            onChange={(e) => { updateHandler(e) }}
                                        /> : null
                                    }

                                </td>
                            
                             </tr>
                        });
                    }
                    if (allUsers.length && !isFiltered) {
                        return allUsers.slice(paginationData.beginPage, paginationData.beginPage + paginationData.step).map((item) => {

                            return <tr key={item.id} className={item.has_tested ? 'table-success' : item.has_hospitilized ? 'table-danger' : ''}>
                                <th scope="row"
                                    data-id={item.id}
                                    style={{
                                        display:'flex',
                                        justifyContent:'flex-start',
                                    }}
                                >{
                                    <button type="button"
                                        onClick={(e)=>{
                                            handleDeleteRequest(item.id)
                                        }}
                                        style={{
                                            margin:'0 10px'
                                        }}
                                    className="btn btn-danger">X</button>
                                }
                                    {!isRedacted(redactedUserId, item) && <button className="btn btn-light"
                                        onClick={(e) => {
                                            setUpdatedData({
                                                id: item.id,
                                                name: item.name,
                                                
                                                has_hospitilized: Boolean(item.has_hospitilized),
                                                has_tested: Boolean(item.has_tested)
                                            });
                                            !isRedacted(redactedUserId, item) ?
                                                setRedactedUserId(item.id) : setRedactedUserId(null);


                                        }}
                                    >
                                        Отредактировать</button>}
                                    {isRedacted(redactedUserId, item)
                                        && <button className="btn btn-warning"
                                            onClick={(e) => updateRequest()}
                                        >Закончить редактирование</button>
                                    }
                                </th>
                                <td>{!isRedacted(redactedUserId, item) && item.name}
                                    {
                                        isRedacted(redactedUserId, item) ? <input

                                            type="text"
                                            value={updatedData.name}
                                            name="name"
                                            onChange={(e) => { updateHandler(e) }}
                                        /> : null
                                    }

                                </td>
                                <td>{!isRedacted(redactedUserId, item) && item.phone_number}
                                    {
                                        isRedacted(redactedUserId, item) ? <input

                                            type="text"
                                            value={updatedData.phone_number}
                                            name="phone_number"
                                            onChange={(e) => { updateHandler(e) }}
                                        /> : null
                                    }

                                </td>
                            
                             </tr>
                        });
                    }
                    return <tr>
                        <th>Записей не найдено</th>
                    </tr>;


                })()}
            </tbody>}
        </table>
        <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <ul
                className="pagination">
                <li
                    className="page-item"><a
                        className="page-link" href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setPag((prevPag) => {
                                console.log(prevPag);
                                return {
                                    ...prevPag,
                                    beginPage: prevPag.beginPage !== 0 ? prevPag.beginPage - 1 : prevPag.beginPage
                                }
                            })
                        }}
                    >{"<"}</a></li>

                {
                    (() => {

                        let pag_list = [];
                        for (let i = 0; i < paginationData.endPage; i++) {
                            if (i >= paginationData.beginPage || i <= paginationData.beginPage + paginationData.step) {
                                pag_list.push(<li key={i}
                                    onClick={(e) => {
                                        setPag({
                                            ...paginationData,
                                            beginPage: i + 1
                                        })
                                    }}
                                    className="page-item"><a className="page-link" href="#"
                                    > {i + 1}</a></li>)
                            }
                        }
                        return pag_list;
                    })()
                }

                <li
                    className="page-item"><a
                        className="page-link"

                        onClick={(e) => {
                            e.preventDefault();
                            setPag((prevPag) => {

                                return {
                                    ...prevPag,
                                    beginPage: prevPag.beginPage < prevPag.endPage ? prevPag.beginPage + 1 : prevPag.beginPage
                                }
                            })
                        }}
                        href="#">{">"}</a></li>
            </ul>
        </div>
        {isLoading && <Preloader />}
        <div className="container">
            <h5>  Добавить новый контакт</h5>
            <div className="form-group">
                <span style={{
                    display: 'flex',
                    flexFlow: 'column',
                    maxWidth: '200px',
                    margin: '0 auto'
                }}>
                    <label htmlFor="name" style={{
                        textAlign: 'start'
                    }}>Имя: </label>
                    <input id="name" type="text"

                        name="name"
                        value={addPatientData.name}
                        onChange={(e) => addHandler(e)}
                    />
                </span>
                <span style={{
                    display: 'flex',
                    flexFlow: 'column',
                    maxWidth: '200px',
                    margin: '0 auto'
                }}>
                <label htmlFor="name" style={{
                        textAlign: 'start'
                    }}>Телефон: </label>   
                <input
                    placeholder="+X(XXX)-XX-XX"
                    type="text"
                    value={addPatientData.phone_number}
                    onChange={(e)=>addHandler(e)}
                name="phone_number"
                />
</span>
</div>
            <div className="form-group">
                <button style={{
                    margin: '10px auto'
                }} className="btn btn-primary"
                    onClick={(e) => { addRequest(e) }}
                >Добавить</button>
            </div>
        </div>

    </div>);
}



