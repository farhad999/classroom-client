import React from "react";
import {axiosInstance} from "../../utils/axios";
import * as _ from 'lodash'
import moment from "moment";

function ClassRoutine() {

    let [routines, setRoutines] = React.useState([]);

    let timeSlots = [{
        startTime: '8:00AM',
        endTime: '9:00AM'
    }, {
        startTime: '9:00AM',
        endTime: '10:00AM',
    }, {
        startTime: '10:00AM',
        endTime: '11:00AM'
    }, {
        startTime: '11:00AM',
        endTime: '12:00PM'
    }, {
        startTime: '12:00PM',
        endTime: '1:00PM'
    }, {
        startTime: '2:00PM',
        endTime: '3:00PM',
    }, {
        startTime: ''
    }]

    React.useEffect( () => {

        axiosInstance.get('/admin/routines/4', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('loginToken')
            }
        }).then(res => {
            let {data} = res;

            setRoutines(processRoutine(data));

           // console.log('ddd', dd['First Year First Semester']);

        }).catch(er => {
            console.log('er', er);
        })


    }, [])

    const processRoutine = (data) => {

        let groupBySemester = _.groupBy(data, 'semesterId');

        let semesters = Object.keys(groupBySemester);

        let routines = [];

        semesters.forEach((semester, semIndex)=> {

            let semesterWiseData = groupBySemester[semester];

            let groupedByDay = _.groupBy(semesterWiseData, 'day');

            //routine assignation

            routines[semIndex] = {
                title: semesterWiseData[0].name,
                semesterId: semesterWiseData[0].semesterId,
                days: {},
            }

            let days = Object.keys(groupedByDay);

            let dayData = [];

            days.forEach((day, dayIndex)=>{
                let routineForADay = groupedByDay[day];

                //let's order it


                let withTime = routineForADay.map((routine) => {
                   let time = moment(routine.startTime, "hh:mma").unix();
                    routine.time = time;
                    return routine;
                });

                let ordered = _.orderBy(withTime, 'time');

                dayData.push({
                    title: day,
                    times: ordered
                });


            })

            routines[semIndex].days = dayData;



        });

        console.log('semester', routines);

        return routines;
    }

    return(
        <div>
            {routines.map((routine, index)=> (
                <div key={index}>
                    <h4>{routine.title}</h4>
                    {routine.days.map((day, dayIndex)=> (
                        <div className={'flex items-center'} key={dayIndex}>
                            {day.title}
                            <div className={'flex space-x-2'}>
                                {day.times.map((time, timeIndex)=> (
                                    <div className={'bg-amber-600 p-2 my-2'} key={timeIndex}>
                                        {time.startTime}-{time.endTime}
                                        <p>{time.courseCode}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )

}

export default ClassRoutine;