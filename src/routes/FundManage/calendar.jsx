import React, { Component } from 'react'
import styles from './calendar.less'
import moment from 'moment'
export default class calendar extends Component{
    constructor(){
        super()
        this.state={
            year: moment().format('YYYY'),
            month: moment().format('MM'),
            weekArr:[]
        }
    }
    componentWillMount(){
        // const {year,month} = this.props
        // if(year){
        //     this.setState({
        //         year:year
        //     })
        // }
        // if(month){
        //     this.setState({
        //         month:month
        //     })
        // }
    }
    componentDidMount(){
        
    }
    content = () => {
        const {year, month} = this.state
        const day = moment(`${year}-${month}`,'YYYY-MM').daysInMonth();
        const week = Math.ceil(day/7)
        let arr = []
        for(let i=0;i<week;i++){
           arr.push(i)
        }
        let today = new Date().getDate()
        
        return (
            arr.map((week,j)=>{
                return (<tr key={j}>
                    {
                        [1,2,3,4,5,6,7].map((day, i)=>{
                            return (
                                <th key={i} className={(week*7+day)==today?styles.blue:(week*7+day)<today?styles.grey:styles.black} >
                                    <div>{week*7+day}</div>
                                </th>
                            )
                        })
                    }
                </tr>)
            })
        )
    }
    render(){
        return(
            <div>
                <table className={styles.fundTable} ref={(el)=>this.table=el}>
                    <tbody>
                        {this.content()}
                    </tbody>
                </table>
            </div>
        )
    }
}