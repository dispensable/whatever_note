/**
 * Created by dispensable on 2016/10/11.
 */

export enum NotificationType {
  success,
  info,
  warning,
  danger,
  personalMessage,
  groupMessage,
  globleMessage,
}

/** type: 决定了通知的类型,success, info, waring, danger可选
 *  content: 通知的内容
 *  timer: 通知出现的时间,负值表示不自动消失 单位:ms */
export class Notification {
  constructor(
    public info_from: string,
    public type: NotificationType,
    public content: string,
    // TODO: add operation to support quick reply
    public timer: number,
    public date: number,
    public info_to: string[],
    public has_read: boolean,
    public token: string,
    public info_from_name: string
  ) {}
}
