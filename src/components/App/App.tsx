import { Div, List, Panel, PanelHeader, SimpleCell, Spinner, Title, View } from "@vkontakte/vkui";
import React, { useEffect, useState } from "react";
import { GROUPS_LIST } from '../../mock/groups';
import { CustomModal } from '../CustomModal';
import Filters from '../Filter';
import styles from './App.module.css';
import { getGroups } from "../../utils/Api";

interface Group {
  id: number;
  name: string;
  closed: boolean;
  avatar_color?: string;
  members_count: number;
  friends?: User[];
}

interface User {
  "first_name": string,
  "last_name": string
}

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

  const [modalIsOpen, setModalIsOpen] = useState(false);
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
                allGroups && (filtredGroups.length > 0 ? filtredGroups.map((item) => (
                  <Div key={item.id} className={styles.group}>
                    <SimpleCell before={<div className={styles["group__avatar"] + " " + (item.avatar_color ? "" : styles["group__avatar_none"])} style={item.avatar_color ? {backgroundColor: item.avatar_color} : {}}></div>}></SimpleCell>
                    <Title level="1" className={styles["group__title"]}>{item.name}</Title>
                    <SimpleCell
                      onClick={() => setActivePanel('nothing')}
                      expandable="auto"
                    >
                      Доступность группы: {item.closed ? "Закрытая" : "Открытая"}
                    </SimpleCell>
                    <SimpleCell
                      onClick={() => setActivePanel('nothing')}
                      expandable="auto"
                    >
                      Количество подписчиков: {item.members_count}
                    </SimpleCell>

                    <div>
                      <button onClick={() => openModal({ friends: item.friends, groupName: item.name })} className={styles["group__friend-button"]}>Количество друзей: {item.friends?.length || 0}</button>
                      <CustomModal isOpen={modalIsOpen} onClose={closeModal} friendsData={friendsData} groupName={groupName}/>
                    </div>
                  </Div>
                )) : (
                <h2 className={styles["not-found"]}>По запросу ничего не найдено &#9785;</h2>
                )))}
            </List>
        </Panel>
      </View>
    </div>
)};

export default App;
