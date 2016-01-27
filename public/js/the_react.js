// So lower case at start won't work, e.g. commentBox, or comment_box
var CommentBox = React.createClass({
  getInitialState: function() {
    return {comments: []};
  },

  load_comment_from_file: function() {  
    $.ajax({
      dataType: "json",
      url: this.props.url,
      success: function(comments) {
        this.setState({comments: comments});

        // Array of object
        //console.log('-test-');
        // Array of object, that is how we define it.
        //console.log(this.state.comments);

      }.bind(this),
      error: function(xhr, status, err) {
        console.log("1", "2", "3", err.toString());
      }.bind(this)
    });
  },

  push_comment_to_file: function(push_url, comment) {
    // We push an object
    $.ajax({
      dataType: "json",
      url: push_url,
      type: "POST",
      data: comment,
      success: function(data) {

        this.setState({comments: data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }.bind(this)
    });

  },

  writeSubmitData: function(obj) {
    //var the_author = obj.the_author;
    //var the_msg = obj.the_msg;
    //http://www.w3schools.com/jsref/jsref_gettime.asp
    obj.id = (new Date()).getTime();
    obj.the_time = (new Date()).toLocaleString();    

    // http://www.w3schools.com/jsref/jsref_concat_array.asp
    // So this.state.comments is array of object, so can merge array
    var new_comments = this.state.comments.concat([obj]);
    //var new_comments = this.state.comments.push(obj);
    
    this.setState({comments: new_comments});

    var pushUrl = this.props.pushUrl;
    this.push_comment_to_file(pushUrl, obj);
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>comment box</h1>
        <CommentList data={this.state.comments} />
        <CommentForm writeSubmitData={this.writeSubmitData} />
      </div>
    );

  },

  componentDidMount: function() {
    this.load_comment_from_file();
  }

});


var CommentList = React.createClass({ 

  render: function() {
    var data = this.props.data;
    var list = [];

    // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
    for(var i in data) {
      list.push(
        <li key={data[i].id}>{data[i].the_time}, {data[i].id}, {data[i].the_author}, {data[i].the_msg}</li>
      );
    }

    
    return (
      <div className="commentList">
        <ul>
          {list}
        </ul>
      </div>
    );
  }
});


var CommentForm = React.createClass({
  getInitialState: function() {
    return {
      the_author: "",
      the_msg: ""
    };
  },
  
  onChangeAuthor: function(e) {
    this.setState({the_author: e.target.value});
  },

  onChangeMsg: function(e) {
    this.setState({the_msg: e.target.value});
  },

  onSubmit: function(e) {
    e.preventDefault();

    // http://www.w3schools.com/js/js_validation.asp
    var the_msg = this.state.the_msg;
    var the_author = this.state.the_author;

    this.props.writeSubmitData({
      the_author: the_author,
      the_msg: the_msg
    });

    this.setState({
      the_author: "",
      the_msg: ""
    });
  },

  render: function() {

    return (
      <form name="commentForm" className="commentForm" onSubmit={this.onSubmit}>
        <h4>Submit your message</h4>

        <input 
          name="the_author" 
          placeholder="the author"
          onChange={this.onChangeAuthor}
        />
        <br/>
        
        <input
          name="the_msg" 
          placeholder="the msg"
          onChange={this.onChangeMsg}
        />
        <br/>
        
        <input 
          type="submit"
          value="submit"
        />
      </form>
    );
  }

});


// https://facebook.github.io/react/docs/getting-started.html
// So the component loads the api, the api then load the comment.js
ReactDOM.render(
  <CommentBox 
    url="/api/get_comment_from_file"
    pushUrl="/api/write_comment_to_file" 
  />,
  document.getElementById("app")
);
