import axios from 'axios';
import Noty from 'noty';
import moment from 'moment'

export function initAdmin(socket) {
    const orderTableBody = document.querySelector('#orderTableBody')
    // console.log(orderTableBody);
    let orders = [];
    let markup

    axios.get('/admin/orders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        // console.log(res.data);
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })


    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${menuItem.item.name}- ${menuItem.qty} pcs</p>
            `
        }).join('')
    }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                    <td class="border px-4 py-2 text-success">
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>
                    </td>
                    <td class="border px-4 py-2">${order.customerId.name}</td>
                    <td class="border px-4 py-2">${order.address}</td>
                    <td class="border px-4 py-2">
                        <div class="d-inline-block relative w-50">
                            <form action="/admin/order/status" method="post">
                                <input type="hidden" name="orderId" value="${order._id}">
                                <select name="status" onchange="this.form.submit()"
                                class="d-block bg-white border 
                                border-gray px-4 py-2 rounded-2
                                shadow-lg">
                                    <option value="order_placed"
                                    ${order.status === 'order_placed' ? 'selected' : ''}>Placed</option>
                                    <option value="confirmed"
                                    ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                    <option value="prepared"
                                    ${order.status === 'prepared' ? 'selected' : ''}>prepared</option>
                                    <option value="delivered"
                                    ${order.status === 'delivered' ? 'selected' : ''}>delivered</option>
                                    <option value="completed"
                                    ${order.status === 'completed' ? 'selected' : ''}>completed</option>
                                </select>
                            </form>
                        </div>
                    </td>
                    <td class="border px-4 py-2">${moment(order.createdAt).format('hh:mm A')}</td>
                </tr>
                `

        }).join('')
    }


    // Socket
    socket.on('orderPlaced', (order) => {
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New order!',
            progressBar: false,
        }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })
}

// module.exports = initAdmin;