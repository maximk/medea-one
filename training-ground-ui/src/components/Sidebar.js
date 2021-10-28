import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import TableChartIcon from '@mui/icons-material/TableChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'

import { useHistory } from 'react-router-dom'

export default function Sidebar() {
    const history = useHistory()

    return (
        <Drawer variant='permanent' anchor='left' sx={{ width: '240px' }}>
            <List>
                <ListItem button onClick={() => history.push('/summary')}>
                    <ListItemIcon><TableChartIcon /></ListItemIcon>
                    <ListItemText>Summary</ListItemText>
                </ListItem>
                <ListItem button onClick={() => history.push('/runs')}>
                    <ListItemIcon><ShowChartIcon /></ListItemIcon>
                    <ListItemText>Sample Runs</ListItemText>
                </ListItem>
            </List>
            <Divider />
        </Drawer>
    )
}
