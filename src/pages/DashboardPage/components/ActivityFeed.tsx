import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiFolderPlus, FiCheckSquare, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import type { ActivityItem, ActivityKind } from '@features/dashboard/utils/aggregate';
import { Panel, PanelHeader, PanelTitle, PanelSub, EmptyState } from './Card.styles';
import { List, Item, IconBubble, Body, Title, Detail, Time } from './ActivityFeed.styles';

const KIND: Record<ActivityKind, { icon: React.ReactNode; color: string }> = {
  note: { icon: <FiMessageSquare size={13} />, color: '#3b82f6' },
  object: { icon: <FiFolderPlus size={13} />, color: '#22a35a' },
  task: { icon: <FiCheckSquare size={13} />, color: '#c9a84c' },
  hours: { icon: <FiClock size={13} />, color: '#cc2222' },
};

const relative = (ms: number): string =>
  formatDistanceToNow(new Date(ms), { locale: de, addSuffix: true });

interface ActivityFeedProps {
  items: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Aktivität</PanelTitle>
        <PanelSub>Neueste Ereignisse</PanelSub>
      </PanelHeader>

      {items.length === 0 ? (
        <EmptyState>Noch keine Aktivität</EmptyState>
      ) : (
        <List>
          {items.map((item) => (
            <Item
              key={item.id}
              $clickable={Boolean(item.objectId)}
              onClick={() => item.objectId && navigate(`/objects/${item.objectId}`)}
            >
              <IconBubble $color={KIND[item.kind].color}>{KIND[item.kind].icon}</IconBubble>
              <Body>
                <Title>{item.title}</Title>
                <Detail>{item.detail}</Detail>
              </Body>
              <Time>{relative(item.at)}</Time>
            </Item>
          ))}
        </List>
      )}
    </Panel>
  );
};
