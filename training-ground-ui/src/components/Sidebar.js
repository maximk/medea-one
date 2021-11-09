import { Divider, Drawer, Typography } from "@mui/material"
import { Link } from "react-router-dom"

function Sidebar() {
    return <Drawer variant='permanent' sx={{ '& .MuiDrawer-paper': { width: 240 } }}>

        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
                <img alt="M1" src="/images/logo.svg" style={{
                    width: 32,
                    paddingLeft: 16,
                    paddingRight: 24,
                    paddingTop: 54
                }} />
                Training Ground
            </Typography>
        </Link>
        <Divider />
    </Drawer>
}

export default Sidebar