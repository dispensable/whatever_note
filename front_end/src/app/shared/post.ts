/**
 * Created by dispensable on 2016/10/17.
 */
export class Post {
  constructor(
    private comments_count: number,
    private content: string,
    private create_date: number,
    private last_modify: number,
    private post_by_name: string,
    private post_by_id: string,
    private post_id: string
  ){ }
}
