<template>
    <el-form  :inline="true"
            label-width="80px" ref="formInline"  @keyup.enter.native="onSubmit">
        <el-form-item v-for="(item) in items" :key="item.key" :label="item.title">
            <!-- 输入框 -->
            <el-input
                v-if="item.type === 'input'"
                type="text"
                :placeholder="$i18n.t('PLEASE_INPUT', { value: item.title })"
                v-model="params[item.key]"
                clearable
                class="input-class"
                :maxlength="item.maxlength || undefined"
            >
            </el-input>

            <!-- 下拉框 -->
            <el-select
                v-else-if="item.type === 'select'"
                v-model="params[item.key]"
                :value="params[item.key]"
                :placeholder="$i18n.t('PLEASE_SELECT', { value: item.title })"
                class="input-class"
                clearable
            >
                <el-option v-for="(option, index) in item.options" :key="index" :label="option.label" :value="option.value"></el-option>
            </el-select>

            <!-- 下拉框 -->
            <el-select
                v-else-if="item.type === 'select_level'"
                v-model="params[item.key]"
                :value="params[item.key]"
                :placeholder="$i18n.t('PLEASE_SELECT', { value: item.title })"
                class="input-class"
                clearable
            >
                <el-option v-for="(option, index) in item.options" :key="index" :label="option.name_text" :value="option.level"></el-option>
            </el-select>

            <!-- 下拉框 -->
            <el-select
                v-else-if="item.type === 'select_category'"
                v-model="params[item.key]"
                :value="params[item.key]"
                :placeholder="$i18n.t('PLEASE_SELECT', { value: item.title })"
                class="input-class"
                clearable
            >
                <el-option v-for="(option, index) in item.options" :key="index" :label="option.name_text" :value="option.id"></el-option>
            </el-select>

            <!-- 下拉框 -->
            <el-select
                v-else-if="item.type === 'select_country_lang'"
                v-model="params[item.key]"
                :value="params[item.key]"
                :placeholder="$i18n.t('PLEASE_SELECT', { value: item.title })"
                class="input-class"
                clearable
            >
                <el-option v-for="(option, index) in item.options" :key="index" :label="option.lang" :value="option.code"></el-option>
            </el-select>

            <!-- 下拉框 -->
            <el-select
                v-else-if="item.type === 'select_team_level'"
                v-model="params[item.key]"
                :value="params[item.key]"
                :placeholder="$i18n.t('PLEASE_SELECT', { value: item.title })"
                class="input-class"
                clearable
            >
                <el-option v-for="(option, index) in item.options" :key="index" :label="option" :value="option"></el-option>
            </el-select>

            <!-- 下拉框 -->
            <el-select
                v-else-if="item.type === 'select_country'"
                v-model="params[item.key]"
                :value="params[item.key]"
                :placeholder="$i18n.t('PLEASE_SELECT', { value: item.title })"
                class="input-class"
                clearable
            >
                <el-option v-for="(option, index) in item.options" :key="index" :label="option.name_text" :value="option.id"></el-option>
            </el-select>

            <!-- 日期范围 -->
            <date-picker
                v-else-if="item.type === 'date-range'"
                type="daterange"
                format="yyyy-MM-dd"
                :split-panels="item.splitPanels||false"
                :placeholder="$i18n.t('PLEASE_SELECT_DATE_RANGE')"
                class="input-class"
                @on-change="(value) => { params[item.key] = value }"
            />

          <!-- 日期范围 -->
          <date-picker
              v-else-if="item.type === 'date'"
              type="date"
              format="yyyy-MM-dd"
              :split-panels="item.splitPanels||false"
              placeholder="请选择时间"
              class="input-class"
              @on-change="(value) => { params[item.key] = value }"
          />

          <!-- el日期范围 -->
          <el-date-picker
              v-else-if="item.type === 'el-date-picker'"
              v-model="params[item.key]"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>

        </el-form-item>
        <el-form-item class="form-opt">
          <el-button size="mini" type="primary" @click="onSubmit" :loading="btnLoading">{{ $i18n.t('搜索') }}</el-button>
          <el-button size="mini" @click="onReset">{{ $i18n.t('重置') }}</el-button>
          <slot></slot>
        </el-form-item>
    </el-form>
</template>

<script>
import  {deepClone} from "../utils";
export default {
        name: 'SearchForm',
        props: {
            items: {
                type: Array,
                required: true
            },
            params: {
                type: Object,
                required: true
            },
            onReset:{
              type: Function,
              required: false
            },
            onSubmit: {
                type: Function,
                required: true
            },
            btnLoading: {
                type: Boolean,
                default: false
            }
        },
      mounted() {
          this.copyParam=deepClone(this.params)
      },
      methods:{

      }
    }
</script>

<style lang="scss" scoped>
    $font-size: 12px;

    .input-class {
        font-size: $font-size;
        width: 180px;
    }
    ::v-deep.el-input,.ivu-input {
        font-size: $font-size;
    }
    ::v-deep.ivu-input {
        font-size: $font-size;
    }
    ::v-deep.ivu-form-item{
      margin-bottom: 10px!important;
    }
    ::v-deep.ivu-form-item-label {
        font-size: $font-size;
    }
    .form-opt{
      ::v-deep.ivu-form-item-content{
        margin-left: 0 !important;
      }
    }
</style>
