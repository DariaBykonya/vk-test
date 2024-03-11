import { List, Panel, PanelHeader, Spinner, View } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import { GROUPS_LIST } from '../../mock/groups';
import Filters from '../Filter';
import { getGroups } from "../../utils/Api";
import styles from './App.module.css';
import { Group, User } from "../../utils/InterfaceApiGroups";
import GroupsList from "../GroupsList";

interface FiltersState {
  privacyType: string;
  avatarColor: string;
  friendCount: string;
}

interface OpenModalProps {
  friends: User[] | undefined, 
  groupName: string
}

function App() {

  const [activePanel, setActivePanel] = React.useState('list');

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [friendsData, setFriendsData] = useState<User[] | undefined>(undefined);
  const [allGroups, setAllGroups] = useState<Group[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [groupName, setGroupName] = useState<string>("");
  const [filtredGroups, setFiltredGroups] = useState<Group[]>([]);

  useEffect(() => {
    const doGetGroups = async () => {
      try {
        const result = await getGroups() as Group[];
        setAllGroups(result);
        setLoading(false);
        setFiltredGroups(result);
      } catch (error) {
        console.log(error);
      }
    };
    
    doGetGroups();
  }, []);

  const filterGroups = (filters: FiltersState) => {

    if (!allGroups) return;

    const filtered = allGroups.filter(group => {

      if (filters.privacyType !== "all" && ((filters.privacyType === "open" && group.closed) || (filters.privacyType === "closed" && !group.closed))) {
        return false;
      }

      if (filters.avatarColor !== "all" && group.avatar_color !== filters.avatarColor) {
        return false;
      }
      return true;
    });

    if (filters.friendCount === "increase") {
      filtered.sort((a, b) => (a.friends?.length || 0) - (b.friends?.length || 0));
    } else if (filters.friendCount === "decrease") {
      filtered.sort((a, b) => (b.friends?.length || 0) - (a.friends?.length || 0));
    }

    setFiltredGroups(filtered);
  };

  const openModal = ({friends, groupName}: OpenModalProps) => {
    if (friends) {
      setModalIsOpen(true);
      setFriendsData(friends);
    } else if (!friends) {
      setModalIsOpen(true);
      setFriendsData([{ first_name: "Друзей", last_name: "нет" }]);
    }

    setGroupName(groupName);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getColorAvatarList = () => {
    const colorSet = new Set<string>();
    GROUPS_LIST.forEach(group => {
      if (group.avatar_color) {
        colorSet.add(group.avatar_color);
      }
    });
    return Array.from(colorSet);
  };

  const colorAvatarList = getColorAvatarList();

  return (
    <div className={styles.app}>
      <View activePanel={activePanel}>
        <Panel id="list">
          <PanelHeader className={styles.title}>Список групп</PanelHeader>
          <Filters onFilterChange={filterGroups} colorAvatarList={colorAvatarList}/>

            <List className={styles.list}>
              {loading ? (
                <div
                aria-busy={true}
                aria-live="polite"
                style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                >
                  <Spinner size="large" style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: "center", gap: "10px" }} />
                </div>
              ) : (
                allGroups && (filtredGroups.length > 0 ? (
                  <GroupsList
                    groupsData={filtredGroups}
                    setActivePanel={() => setActivePanel('nothing')}
                    isOpen={modalIsOpen}
                    onClose={closeModal}
                    friendsData={friendsData}
                    groupName={groupName}
                    openModal={openModal}
                  />
                ) : (
                <h2 className={styles["not-found"]}>По запросу ничего не найдено &#9785;</h2>
                )))}
            </List>
        </Panel>
      </View>
    </div>
)};

export default App;
