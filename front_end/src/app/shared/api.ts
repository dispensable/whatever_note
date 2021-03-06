/**
 * Created by dispensable on 2016/10/17.
 */
export class Api {

  static getHome() {
    return 'http://localhost:4200/';
  }

  static getSingUp() {
    return 'http://localhost:4200/api/user_qualification';
  }

  static getSingIn() {
    return 'http://localhost:4200/api/token';
  }

  static checkEmailNameUnique(item: string, term: string) {
    return `http://localhost:4200/api/${item}?${item}=${term}`;
  }

  static emailConfrimation(token: string) {
    return `http://localhost:4200/api/confirm_token/${token}`;
  }

  static getPosts() {
    return "http://localhost:4200/api/posts";
  }

  static getPost(postid: string) {
    return `http://localhost:4200/api/posts/${postid}`;
  }

  static getPostComments(postid: string) {
    return `http://localhost:4200/api/posts/${postid}/comments`;
  }

  static getUserProfile(userid: string) {
    return `http://localhost:4200/api/users/${userid}`;
  }

  static getUserPosts(userid: string) {
    return `http://localhost:4200/api/users/${userid}/posts`;
  }

  static getUserPostsList(userid: string) {
    return `http://localhost:4200/api/users/${userid}/postslist`;
  }

  static getComment(post_id: string, comment_id: string) {
    return `http://localhost:4200/api/posts/${post_id}/comments/${comment_id}`;
  }

  static getMentionlistByPostid(post_id: string) {
    return `http://localhost:4200/api/users/mentionlist?post_id=${post_id}`;
  }

  static getUserIdByName(username: string) {
    return `http://localhost:4200/api/userid?username=${username}`;
  }

  // get http get localhost:8888/api/notifications?userid=xxxxx&unread=1/0
  static getNotifications(userid: string, unread: number) {
    return `http://localhost:4200/api/notifications?userid=${userid}&unread=${unread}`;
  }


  static getPersonalNotifications(userid: string) {
    return `http://localhost:4200/api/users/${userid}/notifications`;
  }
  // post json['notification']
  static postNotification() {
    return `http://localhost:4200/api/notifications`;
  }

  static setNotificationRead(userid: string, notification_id: string) {
    return `http://localhost:4200/api/notifications?userid=${userid}&notification_id=${notification_id}`;
  }

  static websocketAddr() {
    return `ws://localhost:8888/api/websocket`;
  }

  static getFollowlist(userid: string) {
    return `http://localhost:4200/api/users/${userid}/follow`;
  }

  static addOrRemoveFollow(userid: string, followId: string) {
    return `http://localhost:4200/api/users/${userid}/follow/${followId}`
  }

  static getFollowerList(userid: string) {
    return `http://localhost:4200/api/users/${userid}/follower`;
  }

  static delFollower(userid: string, followerId: string) {
    return `http://localhost:4200/api/users/${userid}/follower/${followerId}`;
  }

  static postImg() {
    return `http://localhost:4200/api/img`;
  }

  static getImg(imgId: string) {
    return `http://localhost:4200/api/img?img_id=${imgId}`;
  }

  static delImgComment(imgId: string, commentId: string) {
    return `http://localhost:4200/api/img/${imgId}/comments/${commentId}`;
  }

  static getAllComments(userid: string) {
    return `http://localhost:4200/api/users/${userid}/comments`
  }

  static deleteComment(userid: string, post_id: string, comment_id: string, comment_type: string) {
    return `http://localhost:4200/api/users/${userid}/comments?post_id=${post_id}&comment_id=${comment_id}&post_type=${comment_type}`
  }
}
