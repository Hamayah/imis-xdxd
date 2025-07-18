// TypeScript types for the evaluation mock
export type GoodBad = 'good' | 'bad';
export interface UQCValues {
  v_clarity: GoodBad | null;
  a_clarity: GoodBad | null;
  v_complete: GoodBad | null;
  first3: GoodBad | null;
  ansa: boolean;
}
export interface UQCRatingResult { score:number; rating:'Good'|'OK'|'Bad'; }

export interface CQCFieldDef { id:string; label:string; help?:string; }
export interface CQCValues { [fieldId:string]: boolean|null; }
export interface CQCRatingResult { score:number; possible:number; pct:number; rating:'Good'|'OK'|'Bad'; }

export interface CaseData {
  room_id:string;
  extra_info:Record<string,any>; // or string
  highlightUrl:string;
  highlightDuration:number; // seconds
  fullUrl:string;
  fullDuration:number; // seconds
}

export const MOCK_CASE:CaseData = {
  room_id: '7525690569877507333',
  extra_info: {"avg_cu":"","best_point_time":"1752280668","create_time":"1752280987","data_type":"2","diamond_count":"99.0","diamond_time":"1752280668.0","duration":"13.016","end_time":"1752280678","game_time":"","generate_total_ms":"36982","input_msg":"","is_talent":"","level":"","moment_type":"","output_result":"","prompt_version":"v0","region":"BR","result_key":"PreviewHighlight_1752280988389_2e19f03b-5eb9-11f0-a8f1-3436ac12008d","reviewer":"nicholaswong","start_time":"1752280665","surge_count":"","surge_rage":"","surge_time":"","surge_time_pv":"","total_like_pv":"","url":"https://v16m-ttgl.tiktokcdn.com/7ddee2434906ab49d6314168c7d4b93a/68993ccf/video/tos/maliva/tos-maliva-v-48829e-us/ogvqEfvph0sTBA4x6PAKEU5roAi7gaCGHLBkAi/?a=1233&bti=MzY5QDQyM2A%3D&ch=0&cr=0&dr=0&cd=0%7C0%7C0%7C0&br=1996&bt=998&ds=4&ft=Gc-1XInz7ThhwfmKXq8Zmo&mime_type=video_mp4&qs=13&rc=anQ3eG45cmZ0NDQzN2Q6M0BpanQ3eG45cmZ0NDQzN2Q6M0BkazRoMmRrc2xhLS1kYjZzYSNkazRoMmRrc2xhLS1kYjZzcw%3D%3D&vvpl=1&l=02175227966589500000000000000000000ffff0a79581286926f&btag=e00070000&download=true&filename=1752281026.mp4"},
  highlightUrl: '/1752281026.mp4',
  highlightDuration: 13.016,
  fullUrl: '/1752281026.mp4',
  fullDuration: 13.016
}; 