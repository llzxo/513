/**
 * Created by llzxo on 2016/1/14.
 */
var RequestApp=React.createClass({
    render:function(){
        return (
            <div>
                <div className="jumbotron text-center">
                    <div className="container">
                        <h1>React求助</h1>
                    </div>
                </div>
                <div className="main container">
                    <RequestForm/>
                    <RequestItem/>
                </div>
            </div>
        );
    }
});

var RequestForm=React.createClass({
    render:function(){
        return(
            <form name="addQuestion" className="clearfix">
                <div className="form-group">
                    <label for="qtitle">问题</label>
                    <input type="text" className="form-control" id="qtitle" placeholder="您的问题的标题"/>
                </div>
                <textarea className="form-control" rows="3" placeholder="问题的描述"></textarea>
                <button className="btn btn-default pull-right">取消</button>
                <button className="btn btn-success pull-right">确认</button>
            </form>
        );
    }
});

var RequestItem=React.createClass({
    render:function(){
        return (
            <div id="questions" className="">
                <div className="media">
                    <div className="media-body">
                        <h4 className="media-heading">求帮带快递</h4>
                        <p>14栋后圆通。带到18-513</p>
                    </div>
                </div>

                <div className="media">
                    <div className="media-body">
                        <h4 className="media-heading">求带一桶泡面</h4>
                        <p>任意口味。带到18-513</p>
                    </div>
                </div>
            </div>
        );
    }
});


ReactDOM.render(
    <RequestApp/>,
    document.getElementById('content')
);
