import axios from 'axios';
import Noty from 'noty';
import {initAdmin} from './admin';
import moment from 'moment';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type : 'success',
            timeout : 1000,
            progressBar : false,
            text : 'Item added to cart'
        }).show();
    }).catch(err => {
        new Noty({
            type : 'error',
            timeout : 1000,
            progressBar : false,
            text : 'Something went wrong'
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}



let statuses = document.querySelectorAll('.status-line')
// console.log(statuses);
let hiddenInput =document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null 
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order);

initAdmin()

// Join
if(order) {
    // console.log(order);
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
// console.log(adminAreaPath);
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    // console.log(data);
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})