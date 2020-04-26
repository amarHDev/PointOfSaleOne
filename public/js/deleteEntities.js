function deleteUser() {
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    console.log(id);
    axios.delete('/users/delete/' + id)
        .then((res) => {
            console.log(res.data)
            alert("L'employer a bien était supprimer ");
            window.location.href = '/'
        })

    .catch((err) => {

        console.log(err)
    });

}

function deleteClient() {
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    console.log(id);
    axios.delete('/client/delete/' + id)
        .then((res) => {
            console.log(res.data)
            alert("Le Client a bien était supprimer ");
            window.location.href = '/client/clientLists'
        })

    .catch((err) => {

        console.log(err)
    });

}

function deleteProduct() {
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    console.log(id);
    axios.delete('/product/delete/' + id)
        .then((res) => {
            console.log(res.data)
            alert("Le produit a bien était supprimer ");
            window.location.href = '/product/ProductList'
        })

    .catch((err) => {

        console.log(err)
    });

}  ;

