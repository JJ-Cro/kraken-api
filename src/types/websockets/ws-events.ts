export interface WsDataEvent<TData = any, TWSKey = string> {
  data: TData;
  table: string;
  wsKey: TWSKey;
}

export interface MessageEventLike {
  target: WebSocket;
  type: 'message';
  data: string;
}

export function isMessageEvent(msg: unknown): msg is MessageEventLike {
  if (typeof msg !== 'object' || !msg) {
    return false;
  }

  const message = msg as MessageEventLike;
  return message['type'] === 'message' && typeof message['data'] === 'string';
}

export type WSSpotAffectedService =
  | 'spot_ws'
  | 'spot_rest'
  | 'spot_fix'
  | 'spot_trading'
  | 'futures_ws'
  | 'futures_rest'
  | 'futures_fix'
  | 'futures_trading'
  | 'all'
  | 'unspecified';

export type WSSpotMaintenancePhase =
  | 'announced'
  | 'reminder_24h'
  | 'approaching_30m'
  | 'imminent_5m'
  | 'final_warning_30s'
  | 'unspecified';

export interface WSSpotStatusNextStep {
  applies_to?: WSSpotAffectedService[];
  type?:
    | 'expected_restart'
    | 'expected_cancel_only'
    | 'expected_post_only'
    | 'expected_online'
    | 'unspecified';
  expected_at_utc?: string;
}

export interface WSSpotUpcomingMaintenance {
  event_id: number;
  title?: string;
  expected_start_utc?: string;
  expected_end_utc?: string | null;
  time_to_start_s?: number;
  phase?: WSSpotMaintenancePhase;
  affected_services?: WSSpotAffectedService[];
  order_submission?: 'allowed' | 'discouraged' | 'blocked' | 'unspecified';
  recommended_action?:
    | 'continue'
    | 'reduce_activity'
    | 'cancel_open_orders'
    | 'stop_new_orders'
    | 'disconnect_and_wait'
    | 'unspecified';
  cancel_before_utc?: string | null;
  source_url?: string;
}

export interface WSSpotEmergency {
  event_id: number;
  title?: string;
  incident_status?:
    | 'investigating'
    | 'identified'
    | 'monitoring'
    | 'unspecified';
  impact?: 'none' | 'minor' | 'major' | 'critical' | 'unspecified';
  affected_services?: WSSpotAffectedService[];
  started_at_utc?: string;
  next_steps?: WSSpotStatusNextStep[];
  source_url?: string;
}

export interface WSSpotStatusData {
  api_version?: string;
  connection_id?: number;
  system: 'online' | 'cancel_only' | 'maintenance' | 'post_only';
  version?: string;
  upcoming_maintenance?: WSSpotUpcomingMaintenance[] | null;
  emergency?: WSSpotEmergency[] | null;
}

export interface WSSpotStatusEvent {
  channel: 'status';
  type: 'update';
  data: WSSpotStatusData[];
}

export interface WSSpotV1SystemStatus {
  event?: 'systemStatus';
  connectionID?: number;
  status?: 'online' | 'cancel_only' | 'maintenance' | 'post_only';
  version?: string;
  upcoming_maintenance?: WSSpotUpcomingMaintenance[] | null;
  emergency?: WSSpotEmergency[] | null;
}
