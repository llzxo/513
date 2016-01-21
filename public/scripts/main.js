/**
 * Created by llzxo on 2016/1/19.
 */
var RequestApp=React.createClass({
        loadRequestsFromServer:function(){
            $.ajax({
                url:this.props.url,
                requestsType:'json',
                cache:false,
                success:function(requests){
                    this.setState({requests:requests});
                }.bind(this),
                error: function (xhr,status,err) {
                    console.error(this.props.url,status,err.toString());
                }.bind(this)
        });
        },

        onNewRequest: function(newRequest) {
        newRequest.id = Date.now();
        var newRequests = requests.concat([newRequest]);
        this.setState({requests: newRequests});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: newRequest,
            success: function(requests) {
                this.setState({requests: requests});
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({requests: requests});
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        },



        getInitialState:function(){
            return{
                requests:[],
                formDisplayed:false
            }
        },
        componentDidMount:function(){
            this.loadRequestsFromServer();
            //setInterval(this.loadRequestsFromServer,this.props.pollInterval);
        },
        toggleFormDisplay:function(){
            this.setState({
                formDisplayed:!this.state.formDisplayed
            })
        },
        //onNewRequest:function(newRequest){
        //  newRequest.key=this.state.requests.length+1;
        //  var newRequests=this.state.requests.concat(newRequest);
        //   newRequests=this.sortRequests(newRequests);
        //    this.setState({
        //       requests:newRequests
        //        });
        // },
        sortRequests:function(requests){
            return requests;
        },
        render:function(){
            return (
                <div>
                    <div className="jumbotron text-center">
                        <div className=" container">
                            <h1>React 互助</h1>
                        </div>
                        <ShowAddButton toggleFormDisplay={this.toggleFormDisplay} />
                    </div>
                    <div className="main container">
                        <RequestForm
                            onNewRequest={this.onNewRequest}
                            toggleFormDisplay={this.toggleFormDisplay}
                            formDisplayed={this.state.formDisplayed} />
                        <RequestList
                            requests={this.state.requests} />
                    </div>
                </div>
            )
        }
    });

var RequestForm=React.createClass({
    handleForm:function(e){

        e.preventDefault();
        if(!this.refs.title.value)return;
        var newRequest={
            title:this.refs.title.value,
            desc:this.refs.desc.value

        };
        this.refs.addRequestForm.reset();
        this.props.onNewRequest(newRequest);
    },
    render:function(){
        var styleObj={
            display:this.props.formDisplayed?'block':'none'
        };
        return(
            <form ref="addRequestForm" style={styleObj} onSubmit={this.handleForm} name="addRequest" className="jumbotron clearfix">
                <div className="form-group">
                    <label htmlFor="form-group">请求</label>
                    <input ref="title" type="text" className="form-control" id="qtitle" placeholder="您的主题"/>
                </div>
                <textarea ref="desc" className="form-control" rows="3" placeholder="问题描述"></textarea>
                <button type="button" className="btn btn-default pull-right" onClick={this.props.toggleFormDisplay}>取消</button>
                <button className="btn btn-success pull-right">确认</button>
            </form>
        );
    }
});

var RequestList=React.createClass({
    render:function(){
        var requests=this.props.requests;
        if(!Array.isArray(requests))throw new Error('requests is not a Array');
        var requestList=requests.map(function(item){
            return <RequestItem
                requestKey={item.key}
                key={item.key}
                title={item.title}
                desc={item.desc}
             />
        }.bind(this));

        return (
            <div id="requests" className="">
                {requestList}
            </div>
        );
    }
});

var RequestItem=React.createClass({
    render:function(){
        return (
            <div className="media" key={this.props.key}>
                <div className="media-body">
                    <h4 className="media-heading">{this.props.title}</h4>
                    <p>{this.props.desc}</p>

                </div>
            </div>
        );
    }
});

var ShowAddButton=React.createClass({
    render:function(){
        return(
            <button id="addRequestBtn" onClick={this.props.toggleFormDisplay} className="btn btn-success">添加问题</button>
        );
    }
});

ReactDOM.render(
    <RequestApp url="/api/requests"  />,
    document.getElementById('content')
);
