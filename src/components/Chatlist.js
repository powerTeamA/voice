import * as React from 'react'
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
} from '@material-ui/core'
import { Image, Work, BeachAccess } from '@material-ui/icons'

export default function InsetDividers() {
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
            }}
        >
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <Image />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="첫 번째 채팅 0000"
                    secondary="Mar 14, 2021"
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <Image />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="두 번째 채팅 0001"
                    secondary="Mar 19, 2021"
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <Image />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="세 번째 채팅 0003"
                    secondary="Apr 12, 2021"
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <Image />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="네 번째 채팅 0004"
                    secondary="Mar 21, 2021"
                />
            </ListItem>
        </List>
    )
}
