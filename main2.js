/**
 * Created by jimmy on 2016/1/14.
 */
var Request = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="request">
        <h2 className="requestAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var RequestApp = React.createClass({
  loadRequestsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleRequestSubmit: function(request) {
    var requests = this.state.data;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    request.id = Date.now();
    var newRequests = requests.concat([request]);
    this.setState({data: newRequests});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: request,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: requests});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadRequestsFromServer();
    setInterval(this.loadRequestsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="requestApp">
        <h1>信息发布</h1>
        <RequestList data={this.state.data} />
        <RequestForm onRequestSubmit={this.handleRequestSubmit} />
      </div>
    );
  }
});

var RequestList = React.createClass({
  render: function() {
    var requestNodes = this.props.data.map(function(request) {
      return (
        <Request author={request.author} key={request.id}>
          {request.text}
        </Request>
      );
    });
    return (
      <div className="requestList">
        {requestNodes}
      </div>
    );
  }
});

var RequestForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onRequestSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form className="requestForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="姓名/地址/电话"
          value={this.state.author}
          onChange={this.handleAuthorChange}
          />
        <input
          type="text"
          placeholder="你要发布的信息。。。"
          value={this.state.text}
          onChange={this.handleTextChange}
          />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

ReactDOM.render(
  <RequestApp url="/api/requests" pollInterval={2000} />,
  document.getElementById('content')
);
