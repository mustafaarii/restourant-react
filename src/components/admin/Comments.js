import React, { Component } from 'react'
import apiURL from '../apiURL'
import turkishDateFormat from '../../helper/turkishDateFormat'
import { Pagination, Loader, Modal, Button, Icon, Alert, ButtonToolbar, Notification } from 'rsuite'
export default class Comments extends Component {

    state = {
        comments: null,
        activePage: null,
        totalPages: null,
        show: false,
        selectedMessage: null
    }

    componentDidMount() {
        this.getComments();
    }


    getComments = (activePage = 1) => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "admin/all_sitecomments?page=" + activePage, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => { this.setState({ comments: data.content, totalPages: data.totalPages }) })
            .catch(err =>{})
    }

    deleteComment = id => {
        const token = sessionStorage.getItem("token");
        fetch(apiURL + "admin/delete_sitecomment?id=" + id, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === true) {Alert.success(data.message); this.getComments();}
                else if (data.status === false) Alert.error(data.error)
            })
            .catch(err => console.log(err))
    }

    handleSelect = (activePage) => {
        this.getComments(activePage);
    }

    showModal = (comment) => {
        const { show } = this.state;
        this.setState({ selectedMessage: comment, show: true })
    }

    closeModal = () => { this.setState({ show: false, selectedMessage: null }) }

    renderNotification = (id) => {
        Notification.info({
            title: 'Onay Kutusu',
            duration: 10000,
            description: (
                <div>
                    <p>Gerçekten bu yorumu silmek istiyor musunuz ?</p><br/>
                    <ButtonToolbar>
                        <Button
                            onClick={() => {
                                this.deleteComment(id);
                                this.closeModal();
                                Notification.close();
                            }}
                        >
                            Sil
                  </Button>
                        <Button
                            onClick={() => {
                                Notification.close();
                            }}
                        >
                            İptal Et
                  </Button>
                    </ButtonToolbar>
                </div>
            )
        })
    }

    renderComments = () => {
        const { comments } = this.state;
        if (comments !== null) {
            return (
                <div>
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#Id</th>
                                <th scope="col">Mail</th>
                                <th scope="col">Tarih</th>
                                <th scope="col">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) =>
                            (
                                <tr key={comment.id}>
                                    <th scope="row">{comment.id}</th>
                                    <td>{comment.user.email}</td>
                                    <td>{turkishDateFormat(new Date(comment.date))}</td>
                                    <td><button type="button" className="btn btn-danger" onClick={() => this.showModal(comment)} >Yorumu Görüntüle</button>
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                    <center>
                        <Pagination prev last next first size="lg" pages={this.state.totalPages} activePage={this.state.activePage} onSelect={this.handleSelect} />
                    </center>
                </div>
            )
        } else {
            return (<Loader center content="Lütfen bekleyin..." />);
        }
    }

    renderModal = () => {
        const { show, selectedMessage } = this.state;
        if (selectedMessage !== null) {
            return (
                <Modal show={show} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title>Yorum Detayları</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b>Üye Mail : </b> {selectedMessage.user.email}<hr />
                            <b>Üye İsmi : </b> {selectedMessage.user.name}<hr />
                            <b>Gönderilen Mesaj : </b>
                            <p>{selectedMessage.comment}</p><hr />
                            <Button style={{ float: "right" }} color="red" onClick={() => this.renderNotification(selectedMessage.id)}><Icon icon="trash" /> Yorumu Sil</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeModal} appearance="subtle">
                            Kapat
            </Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }
    render() {
        return (
            <div className="container" style={{ marginTop: "10%" }}>
                <center><h3>Yorumlar</h3></center><br />
                {this.renderComments()}
                {this.renderModal()}
            </div>
        )
    }
}
