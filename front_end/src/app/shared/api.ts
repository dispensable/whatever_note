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
}
