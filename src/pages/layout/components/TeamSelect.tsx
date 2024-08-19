import { createContext } from 'react';
import { TeamItem } from '@/dataType';
export interface TeamContextType {
  teamData: TeamItem;
}

export const TeamSelect = createContext<TeamContextType>({
  teamData: {
    created_at: '',
    creator: '',
    id: 0,
    owner_quantity: '',
    owners: '',
    team_name: '',
    threshold: '',
    wallet: '',
    isSelect: false
  }
});
export default TeamSelect;
