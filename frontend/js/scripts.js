$(function () {
    // showModal('to tylko test');
});

function showModal(title,msg) {
    //set correct type of modal
    var modal = $('#modalWindow');
    var modalTitle = modal.find('.modal-title');
    var modalBody = modal.find('.modal-body');

    modalTitle.html(title);
    modalBody.html(msg);

    modal.modal('show');
}