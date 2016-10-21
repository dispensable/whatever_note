/**
 * Created by dispensable on 2016/10/21.
 */
export class Comment {
  constructor(
    private comment_id: string,
    private content: string,
    private create_date: number,
    private down: number,
    private hold: number,
    private post_by: string,
    private post_by_id: string,
    private up: number
  ) {}
}
