<template>
<v-container fluid class="pa-0">
    <v-row no-gutters>
        <v-col md="4" cols="4" class="align-self-center">
            <v-btn-toggle dense mandatory :color="currentTheme" v-model="toggleForm">
                <v-btn value="roleEntry">{{ $t('user_role') }}</v-btn>
                <v-btn value="roleObjectMapping">{{ $t('role_user') }}</v-btn>
                <v-btn value="roleMposUser">{{ $t('role_mpos_user') }}</v-btn>
            </v-btn-toggle>
        </v-col>
    </v-row>
    <v-row no-gutters>
        <v-col cols="12">
            <!-- Form "Role Entry" -->
            <role-entry v-show="toggleForm === 'roleEntry'"></role-entry>
            <!-- Form "Role Object Mapping" -->
            <role-object-mapping  v-show="toggleForm === 'roleObjectMapping'"></role-object-mapping>
            <!-- Form "Role Mpos User" -->
            <role-mpos-user  v-show="toggleForm === 'roleMposUser'"></role-mpos-user>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import RoleEntry from '@/components/part/sy/se/syse005_User_Roles'
import RoleObjectMapping from '@/components/part/sy/se/syse005_Roles_User'
import RoleMposUser from '@/components/part/sy/se/syse005_User_Mpos_Roles'
export default {
    layout: 'default',
    middleware: 'user',

    components: {
        RoleEntry,
        RoleObjectMapping,
        RoleMposUser
    },

    data: () => ({
        toggleForm: undefined,
    }),

    computed: {},

    methods: {

    }
}
</script>
